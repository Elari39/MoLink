package shortlink.elari39.github.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import shortlink.elari39.github.config.PublicBaseUrlResolver;
import shortlink.elari39.github.dto.ApiResult;
import shortlink.elari39.github.dto.CreateLinkRequest;
import shortlink.elari39.github.dto.LinkResponse;
import shortlink.elari39.github.dto.LinkStatsResponse;
import shortlink.elari39.github.service.ShortLinkService;

/**
 * 短链管理接口，统一前缀 {@code /api/links}。
 */
@RestController
@RequestMapping("/api/links")
public class ShortLinkController {

    private final ShortLinkService shortLinkService;
    private final PublicBaseUrlResolver publicBaseUrlResolver;

    public ShortLinkController(ShortLinkService shortLinkService, PublicBaseUrlResolver publicBaseUrlResolver) {
        this.shortLinkService = shortLinkService;
        this.publicBaseUrlResolver = publicBaseUrlResolver;
    }

    /**
     * 创建短链。
     *
     * @param request 创建请求
     * @return 统一包装的创建结果
     */
    @PostMapping
    public ApiResult<LinkResponse> create(@Valid @RequestBody CreateLinkRequest request,
                                          HttpServletRequest httpRequest) {
        return ApiResult.ok(shortLinkService.createShortLink(
                request, publicBaseUrlResolver.resolve(httpRequest)));
    }

    /**
     * 查询短链点击统计。
     *
     * @param code     短码
     * @param logLimit 返回的最近访问明细条数，默认 20
     * @return 统计结果
     */
    @GetMapping("/{code}/stats")
    public ApiResult<LinkStatsResponse> stats(
            @PathVariable String code,
            @RequestParam(defaultValue = "20") int logLimit,
            HttpServletRequest request) {
        return ApiResult.ok(shortLinkService.getStats(
                code, logLimit, publicBaseUrlResolver.resolve(request)));
    }
}
