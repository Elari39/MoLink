package shortlink.elari39.github;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import shortlink.elari39.github.config.AppProperties;

/**
 * 墨链 MoLink 短链接服务启动类。
 *
 * <p>开启以下能力：</p>
 * <ul>
 *   <li>{@link EnableConfigurationProperties} —— 绑定自定义配置 {@link AppProperties}（app.* 前缀）。</li>
 *   <li>{@link EnableAsync} —— 支持访问日志与点击计数的异步落库，避免阻塞跳转。</li>
 *   <li>{@link EnableScheduling} —— 支持定时把 Redis 点击计数回写到数据库。</li>
 * </ul>
 */
@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
@EnableAsync
@EnableScheduling
public class ShortLinkApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShortLinkApplication.class, args);
    }
}
