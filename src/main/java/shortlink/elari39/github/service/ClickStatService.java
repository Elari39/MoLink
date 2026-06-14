package shortlink.elari39.github.service;

import java.time.Duration;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import shortlink.elari39.github.entity.AccessLog;
import shortlink.elari39.github.repository.AccessLogRepository;
import shortlink.elari39.github.repository.ShortLinkRepository;

/**
 * 点击统计服务：负责跳转时的异步埋点，以及把 Redis 点击计数定时回写数据库。
 *
 * <p>设计目标是让跳转尽量快、尽量少打数据库：</p>
 * <ul>
 *   <li>跳转时仅在 Redis 里 {@code INCR} 点击计数（O(1)），并把短码加入“脏集合”；</li>
 *   <li>访问明细 {@link AccessLog} 通过 {@link Async} 异步入库，不阻塞 302 响应；</li>
 *   <li>定时任务批量把 Redis 累计的点击增量回写到 {@code short_link.click_count}。</li>
 * </ul>
 */
@Service
public class ClickStatService {

    private static final Logger log = LoggerFactory.getLogger(ClickStatService.class);

    /** 单个短码的点击计数键前缀：shortlink:clicks:{code}。 */
    private static final String CLICKS_KEY_PREFIX = "shortlink:clicks:";

    /** 存放“有待回写增量”的短码集合，供定时任务遍历。 */
    private static final String DIRTY_SET_KEY = "shortlink:clicks:dirty";

    /** 单个短码回写锁，避免多实例/多线程重复累加同一批增量。 */
    private static final String FLUSH_LOCK_KEY_PREFIX = "shortlink:clicks:flush-lock:";

    /** 回写锁过期时间，防止进程异常退出后锁永久残留。 */
    private static final Duration FLUSH_LOCK_TTL = Duration.ofSeconds(30);

    /**
     * 数据库提交成功后再用 Lua 原子扣减 Redis 增量。
     *
     * <p>如果扣减后还有新点击留下计数与脏标记；如果已清零则删除计数并移出脏集合。</p>
     */
    private static final DefaultRedisScript<Long> ACK_FLUSHED_CLICKS_SCRIPT = new DefaultRedisScript<>("""
            local clicksKey = KEYS[1]
            local dirtyKey = KEYS[2]
            local code = ARGV[1]
            local delta = tonumber(ARGV[2])

            if not delta or delta <= 0 then
                return -2
            end

            local currentValue = redis.call('GET', clicksKey)
            if not currentValue then
                redis.call('SREM', dirtyKey, code)
                return 0
            end

            local current = tonumber(currentValue)
            if not current then
                redis.call('DEL', clicksKey)
                redis.call('SREM', dirtyKey, code)
                return -1
            end

            local remaining = current - delta
            if remaining > 0 then
                redis.call('SET', clicksKey, tostring(remaining))
                redis.call('SADD', dirtyKey, code)
            else
                redis.call('DEL', clicksKey)
                redis.call('SREM', dirtyKey, code)
                remaining = 0
            end
            return remaining
            """, Long.class);

    private final StringRedisTemplate redis;
    private final AccessLogRepository accessLogRepository;
    private final ShortLinkRepository shortLinkRepository;
    private final TransactionTemplate transactionTemplate;

    public ClickStatService(StringRedisTemplate redis,
                            AccessLogRepository accessLogRepository,
                            ShortLinkRepository shortLinkRepository,
                            TransactionTemplate transactionTemplate) {
        this.redis = redis;
        this.accessLogRepository = accessLogRepository;
        this.shortLinkRepository = shortLinkRepository;
        this.transactionTemplate = transactionTemplate;
    }

    /**
     * 异步记录一次访问：Redis 计数 +1，短码入脏集合，并落访问明细。
     *
     * @param code      短码
     * @param ip        访问者 IP
     * @param userAgent 访问者 UA
     * @param referer   来源页
     */
    @Async
    public void track(String code, String ip, String userAgent, String referer) {
        try {
            redis.opsForValue().increment(CLICKS_KEY_PREFIX + code);
            redis.opsForSet().add(DIRTY_SET_KEY, code);
            accessLogRepository.save(new AccessLog(code, ip, userAgent, referer));
        } catch (Exception e) {
            // 埋点失败不应影响主流程，仅记录日志
            log.warn("记录访问日志失败, code={}", code, e);
        }
    }

    /**
     * 读取某短码在 Redis 中尚未回写到数据库的点击增量。
     *
     * @param code 短码
     * @return 待回写增量，键不存在时返回 0
     */
    public long pendingClicks(String code) {
        String value = redis.opsForValue().get(CLICKS_KEY_PREFIX + code);
        if (value == null) {
            return 0L;
        }
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            log.warn("Redis 点击计数格式异常, code={}, value={}", code, value);
            return 0L;
        }
    }

    /**
     * 定时把 Redis 累计的点击增量批量回写数据库。
     *
     * <p>先读取 Redis 增量并提交数据库，数据库提交成功后再原子扣减 Redis。
     * 如果数据库更新失败，Redis 计数与脏标记保留，等待下次任务重试。</p>
     */
    @Scheduled(fixedDelayString = "${app.flush-interval-ms:30000}")
    public void flushClicks() {
        Set<String> dirtyCodes = redis.opsForSet().members(DIRTY_SET_KEY);
        if (dirtyCodes == null || dirtyCodes.isEmpty()) {
            return;
        }
        for (String code : dirtyCodes) {
            flushOneCode(code);
        }
        log.debug("点击计数回写完成, 处理短码数={}", dirtyCodes.size());
    }

    private void flushOneCode(String code) {
        String lockKey = FLUSH_LOCK_KEY_PREFIX + code;
        Boolean locked = redis.opsForValue().setIfAbsent(lockKey, "1", FLUSH_LOCK_TTL);
        if (!Boolean.TRUE.equals(locked)) {
            return;
        }

        try {
            String clicksKey = CLICKS_KEY_PREFIX + code;
            String value = redis.opsForValue().get(clicksKey);
            if (value == null) {
                redis.opsForSet().remove(DIRTY_SET_KEY, code);
                return;
            }

            Long delta = parseDelta(code, value);
            if (delta == null) {
                redis.delete(clicksKey);
                redis.opsForSet().remove(DIRTY_SET_KEY, code);
                return;
            }
            if (delta <= 0) {
                redis.opsForSet().remove(DIRTY_SET_KEY, code);
                return;
            }

            transactionTemplate.executeWithoutResult(status -> {
                int updated = shortLinkRepository.incrementClickCount(code, delta);
                if (updated == 0) {
                    log.warn("点击计数回写未命中短链记录, code={}, delta={}", code, delta);
                }
            });

            Long remaining = redis.execute(
                    ACK_FLUSHED_CLICKS_SCRIPT,
                    List.of(clicksKey, DIRTY_SET_KEY),
                    code,
                    String.valueOf(delta));
            if (remaining != null && remaining < 0) {
                log.warn("Redis 点击计数确认扣减异常, code={}, delta={}, result={}", code, delta, remaining);
            }
        } catch (Exception e) {
            log.warn("点击计数回写失败, code={}", code, e);
        } finally {
            redis.delete(lockKey);
        }
    }

    private Long parseDelta(String code, String value) {
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            log.warn("Redis 点击计数格式异常，已清理脏计数, code={}, value={}", code, value);
            return null;
        }
    }
}
