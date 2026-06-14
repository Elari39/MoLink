package shortlink.elari39.github.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import shortlink.elari39.github.config.AppProperties;
import shortlink.elari39.github.dto.CreateLinkRequest;
import shortlink.elari39.github.dto.LinkResponse;
import shortlink.elari39.github.dto.LinkStatsResponse;
import shortlink.elari39.github.entity.ShortLink;
import shortlink.elari39.github.exception.CodeConflictException;
import shortlink.elari39.github.exception.LinkExpiredException;
import shortlink.elari39.github.exception.LinkNotFoundException;
import shortlink.elari39.github.repository.AccessLogRepository;
import shortlink.elari39.github.repository.ShortLinkRepository;
import shortlink.elari39.github.util.Base62;

/**
 * 短链业务实现。
 *
 * <p>发号策略：用 Redis {@code INCR shortlink:seq} 得到全局唯一自增序号，再 Base62 编码为短码。
 * 序号首次使用时通过 {@code SETNX} 初始化为 {@code app.seq-start - 1}，保证首批短码长度达标。</p>
 */
@Service
public class ShortLinkServiceImpl implements ShortLinkService {

    private static final int MIN_LOG_LIMIT = 1;
    private static final int MAX_LOG_LIMIT = 100;

    /** 全局发号计数器键。 */
    private static final String SEQ_KEY = "shortlink:seq";

    /** code → originalUrl 缓存键前缀。 */
    private static final String URL_KEY_PREFIX = "shortlink:url:";

    private final ShortLinkRepository shortLinkRepository;
    private final AccessLogRepository accessLogRepository;
    private final StringRedisTemplate redis;
    private final ClickStatService clickStatService;
    private final AppProperties properties;

    public ShortLinkServiceImpl(ShortLinkRepository shortLinkRepository,
                                AccessLogRepository accessLogRepository,
                                StringRedisTemplate redis,
                                ClickStatService clickStatService,
                                AppProperties properties) {
        this.shortLinkRepository = shortLinkRepository;
        this.accessLogRepository = accessLogRepository;
        this.redis = redis;
        this.clickStatService = clickStatService;
        this.properties = properties;
    }

    @Override
    @Transactional
    public LinkResponse createShortLink(CreateLinkRequest request) {
        String code;
        boolean custom;

        if (request.hasCustomCode()) {
            // 自定义短码：校验长度区间与唯一性
            code = request.customCode();
            if (code.length() < properties.codeMinLength() || code.length() > properties.codeMaxLength()) {
                throw new IllegalArgumentException(
                        "自定义短码长度需在 " + properties.codeMinLength()
                                + "~" + properties.codeMaxLength() + " 之间");
            }
            if (shortLinkRepository.existsByCode(code)) {
                throw new CodeConflictException(code);
            }
            custom = true;
        } else {
            // 自动发号：Redis 自增序号 → Base62
            code = Base62.encode(nextSequence());
            custom = false;
        }

        ShortLink link = new ShortLink(code, request.originalUrl(), custom, request.expireTime());
        try {
            shortLinkRepository.save(link);
        } catch (DataIntegrityViolationException e) {
            // 唯一索引兜底：并发下自定义短码可能仍冲突
            throw new CodeConflictException(code);
        }

        cacheUrl(link);
        return LinkResponse.of(link, properties.baseUrl());
    }

    @Override
    public String resolveAndTrack(String code, String ip, String userAgent, String referer) {
        // 1. 优先读缓存。缓存 TTL 已与过期时间对齐，过期短链不会留在缓存中
        String cachedUrl = redis.opsForValue().get(URL_KEY_PREFIX + code);
        String originalUrl;

        if (cachedUrl != null) {
            originalUrl = cachedUrl;
        } else {
            // 2. 回查数据库并校验存在/过期，再回填缓存
            ShortLink link = shortLinkRepository.findByCode(code)
                    .orElseThrow(() -> new LinkNotFoundException(code));
            if (link.isExpired()) {
                redis.delete(URL_KEY_PREFIX + code);
                throw new LinkExpiredException(code);
            }
            originalUrl = link.getOriginalUrl();
            cacheUrl(link);
        }

        // 3. 异步埋点（计数 + 访问明细），不阻塞跳转
        clickStatService.track(code, ip, userAgent, referer);
        return originalUrl;
    }

    @Override
    @Transactional(readOnly = true)
    public LinkStatsResponse getStats(String code, int logLimit) {
        if (logLimit < MIN_LOG_LIMIT || logLimit > MAX_LOG_LIMIT) {
            throw new IllegalArgumentException(
                    "访问明细条数需在 " + MIN_LOG_LIMIT + "~" + MAX_LOG_LIMIT + " 之间");
        }

        ShortLink link = shortLinkRepository.findByCode(code)
                .orElseThrow(() -> new LinkNotFoundException(code));

        // 总点击 = 数据库已回写值 + Redis 尚未回写的实时增量
        long total = link.getClickCount() + clickStatService.pendingClicks(code);

        List<LinkStatsResponse.AccessLogItem> recentLogs = accessLogRepository
                .findByCode(code, PageRequest.of(0, logLimit, Sort.by(Sort.Direction.DESC, "accessTime")))
                .map(logEntry -> new LinkStatsResponse.AccessLogItem(
                        logEntry.getIp(),
                        logEntry.getUserAgent(),
                        logEntry.getReferer(),
                        logEntry.getAccessTime()))
                .getContent();

        String shortUrl = buildShortUrl(code);
        return new LinkStatsResponse(
                code,
                shortUrl,
                link.getOriginalUrl(),
                total,
                link.getCreateTime(),
                link.getExpireTime(),
                link.isExpired(),
                recentLogs);
    }

    /**
     * 获取下一个全局序号。首次使用时把计数器初始化为 {@code seqStart - 1}，
     * 这样第一次自增后恰好等于配置的起始值。
     */
    private long nextSequence() {
        redis.opsForValue().setIfAbsent(SEQ_KEY, String.valueOf(properties.seqStart() - 1));
        Long seq = redis.opsForValue().increment(SEQ_KEY);
        // increment 在键存在时不会返回 null；此处兜底防御
        return seq == null ? properties.seqStart() : seq;
    }

    /**
     * 把 code→originalUrl 写入缓存，TTL 取“配置缓存时长”与“距过期时间”的较小值，
     * 保证过期短链不会被缓存继续放行。
     */
    private void cacheUrl(ShortLink link) {
        long ttlSeconds = properties.cacheTtlMinutes() * 60;
        if (link.getExpireTime() != null) {
            long secondsToExpire = Duration.between(LocalDateTime.now(), link.getExpireTime()).getSeconds();
            if (secondsToExpire <= 0) {
                return; // 已过期，不缓存
            }
            ttlSeconds = Math.min(ttlSeconds, secondsToExpire);
        }
        redis.opsForValue().set(URL_KEY_PREFIX + link.getCode(), link.getOriginalUrl(),
                ttlSeconds, TimeUnit.SECONDS);
    }

    /** 拼接完整短链。 */
    private String buildShortUrl(String code) {
        String baseUrl = properties.baseUrl();
        return baseUrl.endsWith("/") ? baseUrl + code : baseUrl + "/" + code;
    }
}
