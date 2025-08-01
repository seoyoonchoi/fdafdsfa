package com.example.bookhub_back.repository;

import com.example.bookhub_back.common.enums.PolicyType;
import com.example.bookhub_back.entity.Policy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface PolicyRepository extends JpaRepository<Policy,Long> {
    @Query("""
            SELECT p
            FROM Policy p
                        WHERE(:keyword IS NULL OR p.policyTitle LIKE CONCAT('%', :keyword, '%'))
                             AND(:policyType IS NULL OR p.policyType = :policyType)
                             AND(:start IS NULL OR p.startDate >= :start)
                             AND(:end IS NULL OR p.endDate <= :end)
            ORDER BY p.policyId DESC                                                
            """)
    Page<Policy> findFiltered(
            @Param("keyword")String keyword,
            @Param("policyType")PolicyType policyType,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            Pageable pageable);
}
