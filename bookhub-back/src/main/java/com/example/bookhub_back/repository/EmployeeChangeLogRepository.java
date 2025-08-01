package com.example.bookhub_back.repository;

import com.example.bookhub_back.common.enums.ChangeType;
import com.example.bookhub_back.entity.EmployeeChangeLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface EmployeeChangeLogRepository extends JpaRepository<EmployeeChangeLog, Long> {
    @Query("""
            SELECT e FROM EmployeeChangeLog e
            WHERE (:employeeName IS NULL OR e.employeeId.name LIKE CONCAT('%', :employeeName, '%'))
            AND (:authorizerName IS NULL OR e.authorizerId.name LIKE CONCAT('%', :authorizerName, '%'))
            AND (:changeType IS NULL OR e.changeType = :changeType)
            AND (
              (:startUpdatedAt IS NULL AND :endUpdatedAt IS NULL)
              OR (e.changedAt BETWEEN :startUpdatedAt AND :endUpdatedAt)
            )
        """)
    Page<EmployeeChangeLog> searchEmployeeChangeLogs(
        @Param("employeeName") String employeeName,
        @Param("authorizerName") String authorizerName,
        @Param("changeType") ChangeType changeType,
        @Param("startUpdatedAt") LocalDateTime startUpdatedAt,
        @Param("endUpdatedAt") LocalDateTime endUpdatedAt, Pageable pageable
    );
}
