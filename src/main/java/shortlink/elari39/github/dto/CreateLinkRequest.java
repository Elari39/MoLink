package shortlink.elari39.github.dto;

import java.time.LocalDateTime;

import org.hibernate.validator.constraints.URL;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * 创建短链请求体。
 *
 * @param originalUrl 原始长链接，必填且必须为合法 http/https URL
 * @param customCode  可选自定义短码，仅允许字母与数字；为空则由系统自动发号生成
 * @param expireTime  可选过期时间，为空表示永久有效
 */
public record CreateLinkRequest(

        @NotBlank(message = "原始链接不能为空")
        @URL(regexp = "^(http|https)://.*$", message = "请输入合法的 http/https 链接")
        @Size(max = 2048, message = "链接长度不能超过 2048 个字符")
        String originalUrl,

        @Pattern(regexp = "^[A-Za-z0-9]*$", message = "自定义短码只能包含字母和数字")
        @Size(max = 16, message = "自定义短码长度不能超过 16 个字符")
        String customCode,

        LocalDateTime expireTime
) {
    /** 是否提供了自定义短码。 */
    public boolean hasCustomCode() {
        return customCode != null && !customCode.isBlank();
    }
}
