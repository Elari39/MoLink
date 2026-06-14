package shortlink.elari39.github.exception;

/**
 * 自定义短码已被占用时抛出。
 */
public class CodeConflictException extends RuntimeException {

    public CodeConflictException(String code) {
        super("短码已被占用: " + code);
    }
}
