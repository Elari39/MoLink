package shortlink.elari39.github.dto;

import java.time.LocalDateTime;

import shortlink.elari39.github.entity.ShortLink;

/**
 * 创建短链后的响应体。
 *
 * @param code       短码
 * @param shortUrl   完整短链（baseUrl + / + code）
 * @param originalUrl 原始长链接
 * @param custom     是否为自定义短码
 * @param createTime 创建时间
 * @param expireTime 过期时间，可为空
 */
public record LinkResponse(
        String code,
        String shortUrl,
        String originalUrl,
        boolean custom,
        LocalDateTime createTime,
        LocalDateTime expireTime
) {
    /**
     * 由实体与 baseUrl 构建响应。
     *
     * @param link    短链实体
     * @param baseUrl 对外域名
     */
    public static LinkResponse of(ShortLink link, String baseUrl) {
        String shortUrl = baseUrl.endsWith("/")
                ? baseUrl + link.getCode()
                : baseUrl + "/" + link.getCode();
        return new LinkResponse(
                link.getCode(),
                shortUrl,
                link.getOriginalUrl(),
                link.isCustom(),
                link.getCreateTime(),
                link.getExpireTime()
        );
    }
}
