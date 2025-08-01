package com.example.bookhub_back.repository;

import com.example.bookhub_back.entity.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location,Long> {
    @Query("""
SELECT l
FROM Location l
WHERE(:keyword IS NULL OR l.book.bookTitle LIKE CONCAT('%', :keyword, '%'))
AND(:branchId IS NULL OR l.branch.branchId = :branchId)
ORDER BY l.locationId DESC""")
    Page<Location> findFiltered(
            @Param("keyword") String keyword,
            @Param("branchId") Long branchId,
            Pageable pageable);
}
