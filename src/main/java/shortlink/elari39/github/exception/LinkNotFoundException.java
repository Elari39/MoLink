package shortlink.elari39.github.exception;

/**
 * 短码不存在时抛出。
 */
public class LinkNotFoundException extends RuntimeException {

    public LinkNotFoundException(String code) {
        super("短链不存在: " + code);
    }
}
