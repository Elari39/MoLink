package shortlink.elari39.github.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;

/**
 * Redis 配置。
 *
 * <p>本服务的 Redis 用途均为字符串/数值（发号 seq、code→url 缓存、点击计数），
 * 因此直接使用 {@link StringRedisTemplate}，键值统一按 UTF-8 字符串序列化，
 * 避免默认 JdkSerializer 产生不可读的二进制乱码，也便于在 redis-cli 中排查。</p>
 */
@Configuration
public class RedisConfig {

    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory connectionFactory) {
        return new StringRedisTemplate(connectionFactory);
    }
}
