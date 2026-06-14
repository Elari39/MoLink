package shortlink.elari39.github.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import shortlink.elari39.github.entity.ShortLink;

/**
 * 短链数据访问层。
 */
public interface ShortLinkRepository extends JpaRepository<ShortLink, Long> {

    /** 按短码查询。 */
    Optional<ShortLink> findByCode(String code);

    /** 判断短码是否已存在（用于自定义短码冲突校验）。 */
    boolean existsByCode(String code);

    /**
     * 将指定短码的点击数累加 delta（由 Redis 计数定时回写）。
     *
     * @param code  短码
     * @param delta 本次需要累加的点击增量
     * @return 受影响行数
     */
    @Modifying
    @Query("update ShortLink s set s.clickCount = s.clickCount + :delta where s.code = :code")
    int incrementClickCount(@Param("code") String code, @Param("delta") long delta);
}
