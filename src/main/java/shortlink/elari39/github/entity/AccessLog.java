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
 * 短链访问日志，对应表 {@code access_log}。
 *
 * <p>每次成功跳转异步写入一条，用于点击统计的明细展示。
 * 以 {@code code + access_time} 建复合索引，便于按短码查询最近访问记录。</p>
 */
@Entity
@Table(
        name = "access_log",
        indexes = {
                @Index(name = "idx_access_log_code_time", columnList = "code, access_time")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class AccessLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 被访问的短码。 */
    @Column(nullable = false, length = 32)
    private String code;

    /** 访问者 IP。 */
    @Column(length = 64)
    private String ip;

    /** 访问者 User-Agent。 */
    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    /** 来源页 Referer。 */
    @Column(columnDefinition = "TEXT")
    private String referer;

    /** 访问时间。 */
    @Column(name = "access_time", nullable = false, updatable = false)
    private LocalDateTime accessTime;

    public AccessLog(String code, String ip, String userAgent, String referer) {
        this.code = code;
        this.ip = ip;
        this.userAgent = userAgent;
        this.referer = referer;
        this.accessTime = LocalDateTime.now();
    }
}
