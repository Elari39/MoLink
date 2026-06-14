package shortlink.elari39.github.config;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;

/**
 * 解析用于生成短链接的公网访问地址。
 *
 * <p>优先使用 {@code APP_BASE_URL/app.base-url} 显式配置；未配置时，从反向代理请求头
 * 与当前请求中推导协议和 Host，适配 1Panel/nginx HTTPS 反代与本地访问。</p>
 */
@Component
public class PublicBaseUrlResolver {

    private final AppProperties properties;

    public PublicBaseUrlResolver(AppProperties properties) {
        this.properties = properties;
    }

    public String resolve(HttpServletRequest request) {
        String configuredBaseUrl = normalizeBaseUrl(properties.baseUrl());
        if (configuredBaseUrl != null) {
            return configuredBaseUrl;
        }

        String scheme = firstHeaderValue(request.getHeader("X-Forwarded-Proto"));
        if (scheme == null) {
            scheme = firstHeaderValue(request.getHeader("X-Forwarded-Scheme"));
        }
        if (scheme == null) {
            scheme = request.getScheme();
        }
        scheme = normalizeScheme(scheme);

        String host = firstHeaderValue(request.getHeader("X-Forwarded-Host"));
        if (host == null) {
            host = firstHeaderValue(request.getHeader("Host"));
        }
        if (host == null) {
            host = request.getServerName();
            int port = request.getServerPort();
            if (shouldAppendPort(scheme, port)) {
                host = host + ":" + port;
            }
        }

        return scheme + "://" + host;
    }

    private String normalizeBaseUrl(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String normalized = value.trim();
        while (normalized.endsWith("/")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }
        return normalized.isBlank() ? null : normalized;
    }

    private String firstHeaderValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String first = value.split(",", 2)[0].trim();
        return first.isBlank() ? null : first;
    }

    private String normalizeScheme(String value) {
        if (value == null || value.isBlank()) {
            return "http";
        }
        String scheme = value.trim().toLowerCase();
        if (!scheme.equals("http") && !scheme.equals("https")) {
            return "http";
        }
        return scheme;
    }

    private boolean shouldAppendPort(String scheme, int port) {
        return port > 0
                && !(scheme.equals("http") && port == 80)
                && !(scheme.equals("https") && port == 443);
    }
}
