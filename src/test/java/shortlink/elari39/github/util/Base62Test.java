package shortlink.elari39.github.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

/**
 * {@link Base62} 编解码单元测试。
 */
class Base62Test {

    @Test
    void encodeZeroReturnsFirstChar() {
        assertEquals("0", Base62.encode(0));
    }

    @Test
    void encodeAndDecodeAreReversible() {
        // 覆盖小值、边界与较大值
        long[] samples = {1, 61, 62, 100000, 999999999L, Long.MAX_VALUE};
        for (long value : samples) {
            String encoded = Base62.encode(value);
            assertEquals(value, Base62.decode(encoded),
                    "编解码应可逆, value=" + value);
        }
    }

    @Test
    void seqStartProducesCodeOfAtLeastFourChars() {
        // 发号起始值 62^3=238328 应得到长度 >= 4 的短码（首码为 "1000"）
        assertEquals("1000", Base62.encode(238328));
        assertTrue(Base62.encode(238328).length() >= 4);
    }

    @Test
    void encodeNegativeThrows() {
        assertThrows(IllegalArgumentException.class, () -> Base62.encode(-1));
    }

    @Test
    void decodeEmptyThrows() {
        assertThrows(IllegalArgumentException.class, () -> Base62.decode(""));
        assertThrows(IllegalArgumentException.class, () -> Base62.decode(null));
    }

    @Test
    void decodeIllegalCharThrows() {
        // '-' 不在 Base62 字符表内
        assertThrows(IllegalArgumentException.class, () -> Base62.decode("ab-c"));
    }
}
