package com.example.bookhub_back.repository;

import com.example.bookhub_back.common.enums.Status;
import com.example.bookhub_back.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByLoginId(String loginId);

    boolean existsByLoginId(String loginId);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByEmployeeNumber(Long employeeNumber);

    Optional<Employee> findByEmail(String email);

    @Query("""
            SELECT e FROM Employee e
            WHERE e.isApproved = 'APPROVED'
            AND (:name IS NULL OR e.name LIKE CONCAT('%', :name, '%'))
            AND (:branchId = 0 OR e.branchId.branchId = :branchId)
            AND (:positionId = 0 OR e.positionId.positionId = :positionId)
            AND (:authorityId = 0 OR e.authorityId.authorityId = :authorityId)
            AND (:status IS NULL OR e.status = :status)
        """)
    Page<Employee> searchEmployee(
        @Param("name") String name,
        @Param("branchId") Long branchId,
        @Param("positionId") Long positionId,
        @Param("authorityId") Long authorityId,
        @Param("status") Status status,
        Pageable pageable);
}
