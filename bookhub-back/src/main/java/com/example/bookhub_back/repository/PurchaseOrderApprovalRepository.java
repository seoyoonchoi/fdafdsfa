package com.example.bookhub_back.repository;

import com.example.bookhub_back.entity.PurchaseOrderApproval;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface PurchaseOrderApprovalRepository extends JpaRepository<PurchaseOrderApproval, Long> {
    @Query("""
            SELECT p FROM PurchaseOrderApproval p
            WHERE (:employeeName IS NULL OR p.employeeId.name LIKE CONCAT('%', :employeeName, '%'))
            AND (:isApproved IS NULL OR p.isApproved = :isApproved)
            AND (
              (:startUpdatedAt IS NULL AND :endUpdatedAt IS NULL)
              OR (p.createdAt BETWEEN :startUpdatedAt AND :endUpdatedAt)
            )
        """)
    Page<PurchaseOrderApproval> searchPurchaseOrderApproval(
        @Param("employeeName") String employeeName,
        @Param("isApproved")Boolean isApproved,
        @Param("startUpdatedAt") LocalDateTime startUpdatedAt,
        @Param("endUpdatedAt")LocalDateTime endUpdatedAt,
        Pageable pageable
    );
}
