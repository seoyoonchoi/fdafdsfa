package com.example.bookhub_back.repository;

import com.example.bookhub_back.entity.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BranchRepository extends JpaRepository<Branch, Long> {
    boolean existsByBranchName(String branchName);

    @Query("SELECT b FROM Branch b WHERE (:branchLocation IS NULL OR b.branchLocation LIKE CONCAT('%', :branchLocation, '%'))")
    Page<Branch> searchBranch(@Param("branchLocation") String branchLocation, Pageable pageable);
}
