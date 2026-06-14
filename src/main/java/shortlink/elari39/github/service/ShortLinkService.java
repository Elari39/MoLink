package shortlink.elari39.github.service;

import shortlink.elari39.github.dto.CreateLinkRequest;
import shortlink.elari39.github.dto.LinkResponse;
import shortlink.elari39.github.dto.LinkStatsResponse;

/**
 * 短链业务接口。
 */
public interface ShortLinkService {

    /**
     * 创建短链。
     *
     * @param request 创建请求（含原始链接、可选自定义短码与过期时间）
     * @return 创建结果
     */
    LinkResponse createShortLink(CreateLinkRequest request);

    /**
     * 根据短码解析原始链接（供跳转使用）。
     * 命中后会异步记录访问日志并累加 Redis 点击计数。
     *
     * @param code      短码
     * @param ip        访问者 IP
     * @param userAgent 访问者 UA
     * @param referer   来源页
     * @return 解析得到的原始长链接（已校验存在且未过期）
     */
    String resolveAndTrack(String code, String ip, String userAgent, String referer);

    /**
     * 查询短码统计信息。
     *
     * @param code     短码
     * @param logLimit 返回的最近访问明细条数
     * @return 统计结果
     */
    LinkStatsResponse getStats(String code, int logLimit);
}
