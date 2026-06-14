package shortlink.elari39.github.controller;

import java.net.URI;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import shortlink.elari39.github.exception.LinkExpiredException;
import shortlink.elari39.github.exception.LinkNotFoundException;
import shortlink.elari39.github.service.ShortLinkService;

/**
 * 短码跳转入口。
 *
 * <p>匹配根路径下纯字母数字的短码 {@code /{code}}，正则限定可避免误吃 {@code /api/**}、
 * 静态资源等路径。不存在 / 已过期时直接渲染友好 HTML 页面（不返回 JSON）。</p>
 */
@RestController
public class RedirectController {

    private final ShortLinkService shortLinkService;

    public RedirectController(ShortLinkService shortLinkService) {
        this.shortLinkService = shortLinkService;
    }

    /**
     * 解析短码并 302 跳转到原始链接。
     *
     * @param code    短码（仅字母数字）
     * @param request 用于提取访问者 IP / UA / Referer 做埋点
     * @return 302 重定向；短码不存在返回 404 页面，已过期返回 410 页面
     */
    @GetMapping("/{code:[A-Za-z0-9]+}")
    public ResponseEntity<String> redirect(@PathVariable String code, HttpServletRequest request) {
        try {
            String originalUrl = shortLinkService.resolveAndTrack(
                    code, resolveClientIp(request),
                    request.getHeader("User-Agent"),
                    request.getHeader("Referer"));
            // 302 临时重定向，保留统计能力（每次访问都会回到本服务）
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(originalUrl))
                    .build();
        } catch (LinkNotFoundException e) {
            return htmlPage(HttpStatus.NOT_FOUND, "链接不存在", "您访问的短链接不存在或已被删除。");
        } catch (LinkExpiredException e) {
            return htmlPage(HttpStatus.GONE, "链接已过期", "该短链接已超过有效期，无法继续访问。");
        }
    }

    /**
     * 解析真实客户端 IP，优先取反向代理透传的 X-Forwarded-For 首段。
     */
    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    /**
     * 渲染一个极简的水墨风提示页面。
     */
    private ResponseEntity<String> htmlPage(HttpStatus status, String title, String desc) {
        String html = """
                <!doctype html>
                <html lang="zh">
                <head>
                  <meta charset="utf-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1"/>
                  <title>%s · 墨链 MoLink</title>
                  <style>
                    body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;
                      background:#f3f0e7;color:#3a3a3a;font-family:system-ui,'Segoe UI',sans-serif;}
                    .card{text-align:center;padding:48px 56px;}
                    .logo{font-size:28px;font-weight:700;letter-spacing:4px;margin-bottom:24px;color:#1a1a1a;}
                    h1{font-size:40px;margin:0 0 12px;color:#a63a30;}
                    p{font-size:16px;color:#6b6356;}
                  </style>
                </head>
                <body>
                  <div class="card">
                    <div class="logo">墨链 · MoLink</div>
                    <h1>%s</h1>
                    <p>%s</p>
                  </div>
                </body>
                </html>
                """.formatted(title, title, desc);
        return ResponseEntity.status(status)
                .contentType(MediaType.TEXT_HTML)
                .body(html);
    }
}
