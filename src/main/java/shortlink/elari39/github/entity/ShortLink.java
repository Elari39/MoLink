package shortlink.elari39.github.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 短链实体，对应数据库表 {@code short_link}。
 *
 * <p>短码 {@code code} 建唯一索引，作为对外跳转的主要查询键。</p>
 */
@Entity
@Table(
        name = "short_link",
        indexes = {
                @Index(name = "uk_short_link_code", columnList = "code", unique = true)
        }
)
@Getter
@Setter
@NoArgsConstructor
public class ShortLink {

    /** 自增主键（同时作为 Base62 发号的语义来源）。 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 短码，唯一。Base62 编码或用户自定义。 */
    @Column(nullable = false, length = 32, unique = true)
    private String code;

    /** 原始长链接，使用 TEXT 以容纳超长 URL。 */
    @Column(name = "original_url", nullable = false, columnDefinition = "TEXT")
    private String originalUrl;

    /** 是否为用户自定义短码。 */
    @Column(name = "custom", nullable = false)
    private boolean custom = false;

    /** 累计点击次数（由 Redis 计数定时回写）。 */
    @Column(name = "click_count", nullable = false)
    private long clickCount = 0L;

    /** 创建时间。 */
    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;

    /** 过期时间，可为空表示永久有效。 */
    @Column(name = "expire_time")
    private LocalDateTime expireTime;

    public ShortLink(String code, String originalUrl, boolean custom, LocalDateTime expireTime) {
        this.code = code;
        this.originalUrl = originalUrl;
        this.custom = custom;
        this.expireTime = expireTime;
        this.createTime = LocalDateTime.now();
    }

    /**
     * 判断短链是否已过期。
     *
     * @return 当设置了过期时间且当前时间已超过时返回 true
     */
    public boolean isExpired() {
        return expireTime != null && LocalDateTime.now().isAfter(expireTime);
    }
}
