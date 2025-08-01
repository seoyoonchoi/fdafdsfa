package com.example.bookhub_back.repository;

import com.example.bookhub_back.entity.Alert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByEmployeeId_EmployeeIdOrderByCreatedAtDesc(Long employeeId);
    Page<Alert> findByEmployeeId_EmployeeIdAndIsReadFalseOrderByCreatedAtDesc(Long employeeId, Pageable pageable);
}
