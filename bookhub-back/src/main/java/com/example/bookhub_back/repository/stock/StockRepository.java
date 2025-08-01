package com.example.bookhub_back.repository.stock;

import com.example.bookhub_back.entity.Book;
import com.example.bookhub_back.entity.Branch;
import com.example.bookhub_back.entity.Stock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findByBookIsbnAndBranchId(Book book, Branch branch);


    @Query("""
            SELECT s 
              FROM Stock s
             WHERE (:keyword IS NULL OR s.bookIsbn.bookTitle LIKE CONCAT('%', :keyword, '%'))
               AND (:branchId    IS NULL OR s.branchId.branchId  = :branchId)      
            ORDER BY s.stockId DESC
            """)
    Page<Stock> findFiltered(
            @Param("keyword") String keyword,
            @Param("branchId") Long branchId,
            Pageable pageable);
}
