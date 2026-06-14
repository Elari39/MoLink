package shortlink.elari39.github.config;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.MutablePropertySources;

/**
 * 1Panel 远程存储环境变量适配。
 *
 * <p>开启 APP_REMOTE_STORAGE_ENABLED 后，把 1Panel 常用的 Go 风格 MySQL DSN
 * 与 host:port Redis 地址转换成 Spring Boot 自动配置可识别的属性。</p>
 */
public class RemoteStorageEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    static final String PROPERTY_SOURCE_NAME = "remote-storage-environment";

    private static final String REMOTE_STORAGE_ENABLED = "APP_REMOTE_STORAGE_ENABLED";
    private static final String DATABASE_DSN = "APP_DATABASE_DSN";
    private static final String DATABASE_MAX_OPEN_CONNS = "APP_DATABASE_MAX_OPEN_CONNS";
    private static final String DATABASE_MAX_IDLE_CONNS = "APP_DATABASE_MAX_IDLE_CONNS";
    private static final String REDIS_ADDR = "APP_REDIS_ADDR";
    private static final String REDIS_PASSWORD = "APP_REDIS_PASSWORD";
    private static final String REDIS_DB = "APP_REDIS_DB";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        if (!isRemoteStorageEnabled(environment)) {
            return;
        }

        MutablePropertySources propertySources = environment.getPropertySources();
        if (propertySources.contains(PROPERTY_SOURCE_NAME)) {
            propertySources.remove(PROPERTY_SOURCE_NAME);
        }
        propertySources.addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, buildRemoteProperties(environment)));
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 20;
    }

    static boolean isRemoteStorageEnabled(ConfigurableEnvironment environment) {
        String enabled = environment.getProperty(REMOTE_STORAGE_ENABLED, "false");
        return Boolean.parseBoolean(enabled.trim());
    }

    static Map<String, Object> buildRemoteProperties(ConfigurableEnvironment environment) {
        DatabaseSettings database = parseDatabaseDsn(requiredProperty(environment, DATABASE_DSN));
        RedisAddress redis = parseRedisAddress(requiredProperty(environment, REDIS_ADDR));

        int maxOpenConns = positiveIntProperty(environment, DATABASE_MAX_OPEN_CONNS, 20);
        int maxIdleConns = Math.min(positiveIntProperty(environment, DATABASE_MAX_IDLE_CONNS, 10), maxOpenConns);
        int redisDatabase = nonNegativeIntProperty(environment, REDIS_DB, 0);

        Map<String, Object> properties = new LinkedHashMap<>();
        properties.put("spring.datasource.url", database.jdbcUrl());
        properties.put("spring.datasource.username", database.username());
        properties.put("spring.datasource.password", database.password());
        properties.put("spring.datasource.driver-class-name", "com.mysql.cj.jdbc.Driver");
        properties.put("spring.datasource.hikari.maximum-pool-size", String.valueOf(maxOpenConns));
        properties.put("spring.datasource.hikari.minimum-idle", String.valueOf(maxIdleConns));
        properties.put("spring.data.redis.host", redis.host());
        properties.put("spring.data.redis.port", String.valueOf(redis.port()));
        properties.put("spring.data.redis.password", environment.getProperty(REDIS_PASSWORD, ""));
        properties.put("spring.data.redis.database", String.valueOf(redisDatabase));
        return properties;
    }

    static DatabaseSettings parseDatabaseDsn(String dsn) {
        if (dsn == null || dsn.isBlank()) {
            throw new IllegalStateException("APP_DATABASE_DSN 不能为空：启用远程存储时必须配置 MySQL DSN");
        }

        String trimmed = dsn.trim();
        int tcpMarker = trimmed.indexOf("@tcp(");
        if (tcpMarker <= 0) {
            throw new IllegalStateException("APP_DATABASE_DSN 格式无效：必须形如 user:password@tcp(host:port)/database");
        }

        String credentials = trimmed.substring(0, tcpMarker);
        int passwordMarker = credentials.indexOf(':');
        if (passwordMarker <= 0) {
            throw new IllegalStateException("APP_DATABASE_DSN 格式无效：必须包含 user:password");
        }

        String username = decode(credentials.substring(0, passwordMarker), "APP_DATABASE_DSN 用户名");
        String password = decode(credentials.substring(passwordMarker + 1), "APP_DATABASE_DSN 密码");

        int hostStart = tcpMarker + "@tcp(".length();
        int hostEnd = trimmed.indexOf(')', hostStart);
        if (hostEnd <= hostStart) {
            throw new IllegalStateException("APP_DATABASE_DSN 格式无效：tcp(...) 中必须包含 host:port");
        }

        HostPort hostPort = parseHostPort(trimmed.substring(hostStart, hostEnd), "APP_DATABASE_DSN");
        String pathAndQuery = trimmed.substring(hostEnd + 1);
        if (!pathAndQuery.startsWith("/")) {
            throw new IllegalStateException("APP_DATABASE_DSN 格式无效：必须包含 /database");
        }

        String databaseAndQuery = pathAndQuery.substring(1);
        int queryMarker = databaseAndQuery.indexOf('?');
        String database = queryMarker >= 0 ? databaseAndQuery.substring(0, queryMarker) : databaseAndQuery;
        if (database.isBlank()) {
            throw new IllegalStateException("APP_DATABASE_DSN 格式无效：database 不能为空");
        }

        String query = queryMarker >= 0 ? databaseAndQuery.substring(queryMarker + 1) : "";
        Map<String, String> params = parseQuery(query);
        String charset = valueOrDefault(params.get("charset"), "utf8");
        String loc = valueOrDefault(params.get("loc"), "Asia/Shanghai");
        String serverTimezone = "Local".equalsIgnoreCase(loc) ? "Asia/Shanghai" : loc;

        String jdbcUrl = "jdbc:mysql://" + hostPort.host() + ":" + hostPort.port() + "/" + database
                + "?useUnicode=true"
                + "&characterEncoding=" + charset
                + "&useSSL=false"
                + "&serverTimezone=" + serverTimezone
                + "&allowPublicKeyRetrieval=true";
        return new DatabaseSettings(jdbcUrl, username, password);
    }

    static RedisAddress parseRedisAddress(String addr) {
        if (addr == null || addr.isBlank()) {
            throw new IllegalStateException("APP_REDIS_ADDR 不能为空：启用远程存储时必须配置 Redis host:port");
        }
        HostPort hostPort = parseHostPort(addr, "APP_REDIS_ADDR");
        return new RedisAddress(hostPort.host(), hostPort.port());
    }

    private static String requiredProperty(ConfigurableEnvironment environment, String key) {
        String value = environment.getProperty(key);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(key + " 不能为空：APP_REMOTE_STORAGE_ENABLED=true 时必须配置");
        }
        return value.trim();
    }

    private static int positiveIntProperty(ConfigurableEnvironment environment, String key, int defaultValue) {
        int value = intProperty(environment, key, defaultValue);
        if (value <= 0) {
            throw new IllegalStateException(key + " 必须大于 0");
        }
        return value;
    }

    private static int nonNegativeIntProperty(ConfigurableEnvironment environment, String key, int defaultValue) {
        int value = intProperty(environment, key, defaultValue);
        if (value < 0) {
            throw new IllegalStateException(key + " 不能小于 0");
        }
        return value;
    }

    private static int intProperty(ConfigurableEnvironment environment, String key, int defaultValue) {
        String rawValue = environment.getProperty(key);
        if (rawValue == null || rawValue.isBlank()) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(rawValue.trim());
        } catch (NumberFormatException ex) {
            throw new IllegalStateException(key + " 必须是整数", ex);
        }
    }

    private static HostPort parseHostPort(String rawValue, String sourceName) {
        String value = rawValue == null ? "" : rawValue.trim();
        int marker = value.lastIndexOf(':');
        if (marker <= 0 || marker == value.length() - 1) {
            throw new IllegalStateException(sourceName + " 格式无效：必须形如 host:port");
        }

        String host = value.substring(0, marker).trim();
        String rawPort = value.substring(marker + 1).trim();
        if (host.isEmpty()) {
            throw new IllegalStateException(sourceName + " 格式无效：host 不能为空");
        }

        try {
            int port = Integer.parseInt(rawPort);
            if (port <= 0 || port > 65535) {
                throw new IllegalStateException(sourceName + " 格式无效：port 必须在 1-65535 之间");
            }
            return new HostPort(host, port);
        } catch (NumberFormatException ex) {
            throw new IllegalStateException(sourceName + " 格式无效：port 必须是整数", ex);
        }
    }

    private static Map<String, String> parseQuery(String query) {
        Map<String, String> params = new LinkedHashMap<>();
        if (query == null || query.isBlank()) {
            return params;
        }

        for (String pair : query.split("&")) {
            if (pair.isBlank()) {
                continue;
            }
            int marker = pair.indexOf('=');
            String key = marker >= 0 ? pair.substring(0, marker) : pair;
            String value = marker >= 0 ? pair.substring(marker + 1) : "";
            params.put(decode(key, "APP_DATABASE_DSN 查询参数"), decode(value, "APP_DATABASE_DSN 查询参数"));
        }
        return params;
    }

    private static String valueOrDefault(String value, String defaultValue) {
        return value == null || value.isBlank() ? defaultValue : value;
    }

    private static String decode(String value, String fieldName) {
        try {
            return URLDecoder.decode(value, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException ex) {
            throw new IllegalStateException(fieldName + " URL 编码无效", ex);
        }
    }

    static record DatabaseSettings(String jdbcUrl, String username, String password) {
    }

    static record RedisAddress(String host, int port) {
    }

    private static record HostPort(String host, int port) {
    }
}
