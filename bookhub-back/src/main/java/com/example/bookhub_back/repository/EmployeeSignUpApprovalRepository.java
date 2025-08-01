package com.example.bookhub_back.repository;

import com.example.bookhub_back.common.enums.IsApproved;
import com.example.bookhub_back.entity.Employee;
import com.example.bookhub_back.entity.EmployeeSignUpApproval;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EmployeeSignUpApprovalRepository extends JpaRepository<EmployeeSignUpApproval, Long> {
    Optional<EmployeeSignUpApproval> findByEmployeeIdAndIsApproved(Employee employee, IsApproved isApproved);

    @Query("""
            SELECT e FROM EmployeeSignUpApproval e
            WHERE e.isApproved = :isApproved
        """)
    Page<EmployeeSignUpApproval> searchEmployee(IsApproved isApproved, Pageable pageable);

    @Query("""
            SELECT esa FROM EmployeeSignUpApproval esa
            JOIN esa.employeeId e
            JOIN esa.authorizerId a
            WHERE (:employeeName IS NULL OR e.name LIKE CONCAT('%', :employeeName, '%'))
              AND (:isApproved IS NULL OR esa.isApproved = :isApproved)
              AND (:deniedReason IS NULL OR (esa.deniedReason IS NOT NULL AND esa.deniedReason = :deniedReason))
              AND (:authorizerName IS NULL OR a.name LIKE CONCAT('%', :authorizerName, '%'))
              AND (
                (:startUpdatedAt IS NULL AND :endUpdatedAt IS NULL)
                OR (esa.updatedAt BETWEEN :startUpdatedAt AND :endUpdatedAt)
            )
        """)
    Page<EmployeeSignUpApproval> searchSignUpApproval(
        @Param("employeeName") String employeeName,
        @Param("isApproved") IsApproved isApproved,
        @Param("deniedReason") String deniedReason,
        @Param("authorizerName") String authorizerName,
        @Param("startUpdatedAt") LocalDateTime startUpdatedAt,
        @Param("endUpdatedAt") LocalDateTime endUpdatedAt,
        Pageable pageable
    );
}