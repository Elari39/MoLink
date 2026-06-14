package shortlink.elari39.github.exception;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import shortlink.elari39.github.dto.ApiResult;

/**
 * 全局异常处理，统一把各类异常转换为 {@link ApiResult} 结构 + 合适的 HTTP 状态码。
 *
 * <p>注意：仅拦截 REST 接口（/api/**）的异常。短码跳转 {@code /{code}} 的
 * not-found / expired 由 RedirectController 自行渲染页面，不走此处的 JSON 响应。</p>
 */
@RestControllerAdvice(basePackages = "shortlink.elari39.github.controller")
public class GlobalExceptionHandler {

    /** 参数校验失败（@Valid）。 */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResult<Void>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        return ResponseEntity.badRequest().body(ApiResult.error(400, message));
    }

    /** 业务参数非法（如自定义短码长度越界）。 */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResult<Void>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ApiResult.error(400, ex.getMessage()));
    }

    /** 自定义短码冲突。 */
    @ExceptionHandler(CodeConflictException.class)
    public ResponseEntity<ApiResult<Void>> handleConflict(CodeConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResult.error(409, ex.getMessage()));
    }

    /** 短码不存在。 */
    @ExceptionHandler(LinkNotFoundException.class)
    public ResponseEntity<ApiResult<Void>> handleNotFound(LinkNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResult.error(404, ex.getMessage()));
    }

    /** 短链已过期。 */
    @ExceptionHandler(LinkExpiredException.class)
    public ResponseEntity<ApiResult<Void>> handleExpired(LinkExpiredException ex) {
        return ResponseEntity.status(HttpStatus.GONE)
                .body(ApiResult.error(410, ex.getMessage()));
    }

    /** 兜底：其余未预期异常。 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResult<Void>> handleOthers(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResult.error(500, "服务器内部错误: " + ex.getMessage()));
    }
}
