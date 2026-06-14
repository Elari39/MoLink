package shortlink.elari39.github.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import shortlink.elari39.github.entity.AccessLog;

/**
 * 访问日志数据访问层。
 */
public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {

    /** 按短码分页查询访问日志，按访问时间倒序由调用方通过 Pageable 指定。 */
    Page<AccessLog> findByCode(String code, Pageable pageable);

    /** 统计某短码的访问总数。 */
    long countByCode(String code);
}
