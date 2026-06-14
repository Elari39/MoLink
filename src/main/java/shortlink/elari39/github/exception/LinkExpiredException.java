package shortlink.elari39.github.exception;

/**
 * 短链已过期时抛出。
 */
public class LinkExpiredException extends RuntimeException {

    public LinkExpiredException(String code) {
        super("短链已过期: " + code);
    }
}
