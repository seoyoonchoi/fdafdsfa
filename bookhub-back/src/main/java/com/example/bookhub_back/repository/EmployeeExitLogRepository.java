package com.example.bookhub_back.repository;

import com.example.bookhub_back.common.enums.ExitReason;
import com.example.bookhub_back.entity.EmployeeExitLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface EmployeeExitLogRepository extends JpaRepository<EmployeeExitLog, Long> {
    @Query("""
        SELECT e FROM EmployeeExitLog e
        WHERE (:employeeName IS NULL OR e.employeeId.name LIKE CONCAT('%', :employeeName, '%'))
        AND (:authorizerName IS NULL OR e.authorizerId.name LIKE CONCAT('%', :authorizerName, '%'))
        AND (:exitReason IS NULL OR e.exitReason = :exitReason)
        AND (
              (:startUpdatedAt IS NULL AND :endUpdatedAt IS NULL)
              OR (e.exitAt BETWEEN :startUpdatedAt AND :endUpdatedAt)
            )
        """)
    Page<EmployeeExitLog> searchEmployeeExitLogs(
        @Param("employeeName") String employeeName,
        @Param("authorizerName") String authorizerName,
        @Param("exitReason") ExitReason exitReason,
        @Param("startUpdatedAt") LocalDateTime startUpdatedAt,
        @Param("endUpdatedAt") LocalDateTime endUpdatedAt,
        Pageable pageable
    );
}
