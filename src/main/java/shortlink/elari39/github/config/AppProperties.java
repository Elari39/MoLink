package shortlink.elari39.github.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 短链服务自定义配置，绑定 application.yml 中 {@code app.*} 前缀的属性。
 *
 * @param baseUrl  生成短链时拼接的对外访问域名（含协议），如 https://shorten.miku831.fun
 * @param seqStart Redis 发号起始值。设为 62^3=238328 可保证首批短码长度 ≥4，更美观
 * @param cacheTtlMinutes 短链原始地址在 Redis 中的缓存过期时间（分钟）
 * @param codeMinLength 自定义短码允许的最小长度
 * @param codeMaxLength 自定义短码允许的最大长度
 */
@ConfigurationProperties(prefix = "app")
public record AppProperties(
        String baseUrl,
        long seqStart,
        long cacheTtlMinutes,
        int codeMinLength,
        int codeMaxLength
) {
    /**
     * 为未在配置文件中显式设置的属性提供默认值，避免空值导致启动失败。
     */
    public AppProperties {
        if (baseUrl == null || baseUrl.isBlank()) {
            baseUrl = "https://shorten.miku831.fun";
        }
        if (seqStart <= 0) {
            seqStart = 238328L; // 62^3，保证首批短码长度 >= 4
        }
        if (cacheTtlMinutes <= 0) {
            cacheTtlMinutes = 60L;
        }
        if (codeMinLength <= 0) {
            codeMinLength = 4;
        }
        if (codeMaxLength <= 0) {
            codeMaxLength = 16;
        }
    }
}
