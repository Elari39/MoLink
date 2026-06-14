package shortlink.elari39.github.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 短链点击统计响应体。
 *
 * @param code        短码
 * @param shortUrl    完整短链
 * @param originalUrl 原始长链接
 * @param totalClicks 总点击数（DB 已回写值 + Redis 实时未回写增量）
 * @param createTime  创建时间
 * @param expireTime  过期时间，可为空
 * @param expired     是否已过期
 * @param recentLogs  最近访问明细（分页）
 */
public record LinkStatsResponse(
        String code,
        String shortUrl,
        String originalUrl,
        long totalClicks,
        LocalDateTime createTime,
        LocalDateTime expireTime,
        boolean expired,
        List<AccessLogItem> recentLogs
) {
    /**
     * 单条访问明细。
     *
     * @param ip         访问者 IP
     * @param userAgent  访问者 UA
     * @param referer    来源页
     * @param accessTime 访问时间
     */
    public record AccessLogItem(
            String ip,
            String userAgent,
            String referer,
            LocalDateTime accessTime
    ) {
    }
}
