package shortlink.elari39.github.util;

/**
 * Base62 编解码工具。
 *
 * <p>使用 62 个字符（0-9、a-z、A-Z）表示数值，把自增 ID 压缩成短小的字符串短码。
 * 例如十进制 100000 → "q0U"。该编码可逆，便于与自增 ID 一一对应、保证无冲突。</p>
 *
 * <p>本类为无状态工具类，方法均为静态，线程安全。</p>
 */
public final class Base62 {

    /** Base62 字符表，索引即对应数值。 */
    private static final String ALPHABET =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    /** 进制基数 62。 */
    private static final int BASE = ALPHABET.length();

    private Base62() {
        // 工具类禁止实例化
    }

    /**
     * 将非负整数编码为 Base62 字符串。
     *
     * @param value 非负整数（通常为发号得到的自增 ID）
     * @return Base62 短码；value 为 0 时返回 "0"
     * @throws IllegalArgumentException 当 value 为负数时
     */
    public static String encode(long value) {
        if (value < 0) {
            throw new IllegalArgumentException("Base62 编码不支持负数: " + value);
        }
        if (value == 0) {
            return String.valueOf(ALPHABET.charAt(0));
        }
        // 逐位取模得到低位到高位的字符，最后反转
        StringBuilder sb = new StringBuilder();
        while (value > 0) {
            int remainder = (int) (value % BASE);
            sb.append(ALPHABET.charAt(remainder));
            value /= BASE;
        }
        return sb.reverse().toString();
    }

    /**
     * 将 Base62 字符串解码回整数。
     *
     * @param code Base62 短码
     * @return 解码后的整数
     * @throws IllegalArgumentException 当 code 为空或包含非法字符时
     */
    public static long decode(String code) {
        if (code == null || code.isEmpty()) {
            throw new IllegalArgumentException("待解码的短码不能为空");
        }
        long result = 0;
        for (int i = 0; i < code.length(); i++) {
            int digit = ALPHABET.indexOf(code.charAt(i));
            if (digit < 0) {
                throw new IllegalArgumentException("短码包含非法 Base62 字符: " + code.charAt(i));
            }
            result = result * BASE + digit;
        }
        return result;
    }
}
