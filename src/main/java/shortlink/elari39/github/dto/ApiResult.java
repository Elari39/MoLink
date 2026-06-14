package shortlink.elari39.github.dto;

/**
 * 统一 API 响应包装。
 *
 * @param <T>     业务数据类型
 * @param code    业务状态码：0 表示成功，非 0 表示各类错误
 * @param message 提示信息
 * @param data    业务数据，错误时为 null
 */
public record ApiResult<T>(int code, String message, T data) {

    /** 成功（无数据）。 */
    public static <T> ApiResult<T> ok() {
        return new ApiResult<>(0, "success", null);
    }

    /** 成功（带数据）。 */
    public static <T> ApiResult<T> ok(T data) {
        return new ApiResult<>(0, "success", data);
    }

    /** 失败。 */
    public static <T> ApiResult<T> error(int code, String message) {
        return new ApiResult<>(code, message, null);
    }
}
