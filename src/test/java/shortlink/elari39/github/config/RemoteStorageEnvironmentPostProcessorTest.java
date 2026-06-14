package shortlink.elari39.github.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

class RemoteStorageEnvironmentPostProcessorTest {

    private final RemoteStorageEnvironmentPostProcessor postProcessor =
            new RemoteStorageEnvironmentPostProcessor();

    @Test
    void disabledByDefaultDoesNotOverrideLocalProperties() {
        MockEnvironment environment = new MockEnvironment();

        postProcessor.postProcessEnvironment(environment, null);

        assertNull(environment.getProperty("spring.datasource.hikari.maximum-pool-size"));
        assertNull(environment.getProperty("spring.data.redis.database"));
    }

    @Test
    void postProcessMapsRemoteStorageVariables() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("APP_REMOTE_STORAGE_ENABLED", "true")
                .withProperty(
                        "APP_DATABASE_DSN",
                        "notes_user:secret@tcp(mysql.example.com:3306)/notes_of_ashen"
                                + "?charset=utf8mb4&parseTime=true&loc=Local")
                .withProperty("APP_DATABASE_MAX_OPEN_CONNS", "8")
                .withProperty("APP_DATABASE_MAX_IDLE_CONNS", "12")
                .withProperty("APP_REDIS_ADDR", "redis.example.com:6379")
                .withProperty("APP_REDIS_PASSWORD", "redis-secret")
                .withProperty("APP_REDIS_DB", "1");

        postProcessor.postProcessEnvironment(environment, null);

        assertEquals(
                "jdbc:mysql://mysql.example.com:3306/notes_of_ashen"
                        + "?useUnicode=true&characterEncoding=utf8mb4&useSSL=false"
                        + "&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true",
                environment.getProperty("spring.datasource.url"));
        assertEquals("notes_user", environment.getProperty("spring.datasource.username"));
        assertEquals("secret", environment.getProperty("spring.datasource.password"));
        assertEquals("8", environment.getProperty("spring.datasource.hikari.maximum-pool-size"));
        assertEquals("8", environment.getProperty("spring.datasource.hikari.minimum-idle"));
        assertEquals("redis.example.com", environment.getProperty("spring.data.redis.host"));
        assertEquals("6379", environment.getProperty("spring.data.redis.port"));
        assertEquals("redis-secret", environment.getProperty("spring.data.redis.password"));
        assertEquals("1", environment.getProperty("spring.data.redis.database"));
    }

    @Test
    void postProcessUsesConnectionAndRedisDefaults() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("APP_REMOTE_STORAGE_ENABLED", "true")
                .withProperty("APP_DATABASE_DSN", "user:password@tcp(mysql.example.com:3306)/shortlink")
                .withProperty("APP_REDIS_ADDR", "redis.example.com:6379");

        postProcessor.postProcessEnvironment(environment, null);

        assertEquals("20", environment.getProperty("spring.datasource.hikari.maximum-pool-size"));
        assertEquals("10", environment.getProperty("spring.datasource.hikari.minimum-idle"));
        assertEquals("", environment.getProperty("spring.data.redis.password"));
        assertEquals("0", environment.getProperty("spring.data.redis.database"));
    }

    @Test
    void enabledWithoutDatabaseDsnThrows() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("APP_REMOTE_STORAGE_ENABLED", "true")
                .withProperty("APP_REDIS_ADDR", "redis.example.com:6379");

        assertThrows(IllegalStateException.class, () -> postProcessor.postProcessEnvironment(environment, null));
    }

    @Test
    void invalidDatabaseDsnThrows() {
        assertThrows(
                IllegalStateException.class,
                () -> RemoteStorageEnvironmentPostProcessor.parseDatabaseDsn("invalid"));
    }

    @Test
    void parsesRedisHostPort() {
        RemoteStorageEnvironmentPostProcessor.RedisAddress redis =
                RemoteStorageEnvironmentPostProcessor.parseRedisAddress("redis.example.com:6379");

        assertEquals("redis.example.com", redis.host());
        assertEquals(6379, redis.port());
    }
}
