package com.example.bookhub_back.repository;

import com.example.bookhub_back.entity.Reception;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReceptionRepository extends JpaRepository <Reception, Long> {
    @Query("""
    SELECT r FROM Reception r
    JOIN Employee e ON e.branchId.branchName = r.branchName
    WHERE e.loginId = :loginId
    AND r.isReceptionApproved = false        
    """)
    Page<Reception> findPendingByLoginId(@Param("loginId") String loginId, Pageable pageable);

    @Query("""
    SELECT r FROM Reception r
    JOIN FETCH r.receptionEmployeeId e
    JOIN FETCH r.purchaseOrderApprovalId p
    JOIN Employee emp ON emp.branchId.branchName = r.branchName
    WHERE emp.loginId = :loginId
    AND r.isReceptionApproved = true
    AND (:startDate IS NULL OR r.receptionDateAt >= :startDate)
    AND (:endDate IS NULL OR r.receptionDateAt <= :endDate)
    """)
    Page<Reception> findAllConfirmedByLoginId(
            @Param("loginId") String loginId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    @Query("""
    SELECT r FROM Reception r
    JOIN FETCH r.receptionEmployeeId e
    JOIN FETCH r.purchaseOrderApprovalId p
    WHERE r.isReceptionApproved = true
    AND (:branchName IS NULL OR r.branchName LIKE %:branchName%)
    AND (:bookIsbn IS NULL OR r.bookIsbn LIKE %:bookIsbn%)
    """)
    Page<Reception> findAllConfirmedLogsWithFilter(
            @Param("branchName") String branchName,
            @Param("bookIsbn") String bookIsbn,
            Pageable pageable);
}
