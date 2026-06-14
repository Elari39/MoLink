package shortlink.elari39.github.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.SimpleTransactionStatus;
import org.springframework.transaction.support.TransactionTemplate;

import shortlink.elari39.github.repository.AccessLogRepository;
import shortlink.elari39.github.repository.ShortLinkRepository;

/**
 * {@link ClickStatService} 点击计数回写逻辑测试。
 */
@ExtendWith(MockitoExtension.class)
class ClickStatServiceTest {

    private static final String DIRTY_SET_KEY = "shortlink:clicks:dirty";
    private static final String CLICKS_KEY = "shortlink:clicks:abc";
    private static final String LOCK_KEY = "shortlink:clicks:flush-lock:abc";

    @Mock
    private StringRedisTemplate redis;
    @Mock
    private ValueOperations<String, String> valueOps;
    @Mock
    private SetOperations<String, String> setOps;
    @Mock
    private AccessLogRepository accessLogRepository;
    @Mock
    private ShortLinkRepository shortLinkRepository;

    private ClickStatService service;

    @BeforeEach
    void setUp() {
        lenient().when(redis.opsForValue()).thenReturn(valueOps);
        lenient().when(redis.opsForSet()).thenReturn(setOps);

        TransactionTemplate transactionTemplate = new TransactionTemplate(new NoopTransactionManager());
        service = new ClickStatService(redis, accessLogRepository, shortLinkRepository, transactionTemplate);
    }

    @Test
    void pendingClicksWithInvalidValueReturnsZero() {
        when(valueOps.get(CLICKS_KEY)).thenReturn("not-a-number");

        assertEquals(0L, service.pendingClicks("abc"));
    }

    @Test
    void flushClicksWritesDatabaseThenAcknowledgesRedis() {
        when(setOps.members(DIRTY_SET_KEY)).thenReturn(Set.of("abc"));
        when(valueOps.setIfAbsent(LOCK_KEY, "1", Duration.ofSeconds(30))).thenReturn(true);
        when(valueOps.get(CLICKS_KEY)).thenReturn("5");
        when(shortLinkRepository.incrementClickCount("abc", 5L)).thenReturn(1);
        when(redis.execute(any(DefaultRedisScript.class), anyList(), eq("abc"), eq("5")))
                .thenReturn(0L);

        service.flushClicks();

        verify(shortLinkRepository).incrementClickCount("abc", 5L);
        verify(redis).execute(any(DefaultRedisScript.class), anyList(), eq("abc"), eq("5"));
        verify(redis).delete(LOCK_KEY);
    }

    @Test
    void flushClicksKeepsRedisDeltaWhenDatabaseFails() {
        when(setOps.members(DIRTY_SET_KEY)).thenReturn(Set.of("abc"));
        when(valueOps.setIfAbsent(LOCK_KEY, "1", Duration.ofSeconds(30))).thenReturn(true);
        when(valueOps.get(CLICKS_KEY)).thenReturn("5");
        when(shortLinkRepository.incrementClickCount("abc", 5L))
                .thenThrow(new DataAccessResourceFailureException("database down"));

        service.flushClicks();

        verify(redis, never()).execute(any(DefaultRedisScript.class), anyList(), any(), any());
        verify(setOps, never()).remove(DIRTY_SET_KEY, "abc");
        verify(redis).delete(LOCK_KEY);
    }

    @Test
    void flushClicksCleansInvalidCounterValue() {
        when(setOps.members(DIRTY_SET_KEY)).thenReturn(Set.of("abc"));
        when(valueOps.setIfAbsent(LOCK_KEY, "1", Duration.ofSeconds(30))).thenReturn(true);
        when(valueOps.get(CLICKS_KEY)).thenReturn("broken");

        service.flushClicks();

        verify(shortLinkRepository, never()).incrementClickCount(anyString(), anyLong());
        verify(redis).delete(CLICKS_KEY);
        verify(setOps).remove(DIRTY_SET_KEY, "abc");
        verify(redis).delete(LOCK_KEY);
    }

    private static class NoopTransactionManager implements PlatformTransactionManager {

        @Override
        public TransactionStatus getTransaction(TransactionDefinition definition) {
            return new SimpleTransactionStatus();
        }

        @Override
        public void commit(TransactionStatus status) {
            // no-op for unit tests
        }

        @Override
        public void rollback(TransactionStatus status) {
            // no-op for unit tests
        }
    }
}
