package com.example.bookhub_back.repository.statistics;

import com.example.bookhub_back.common.enums.StockActionType;
import com.example.bookhub_back.dto.statistics.projection.BranchStockBarChartProjection;
import com.example.bookhub_back.dto.statistics.projection.CategoryStockProjection;
import com.example.bookhub_back.dto.statistics.projection.TimeStockChartProjection;
import com.example.bookhub_back.dto.statistics.projection.ZeroStockProjection;
import com.example.bookhub_back.entity.StockLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StocksStatisticsRepository extends JpaRepository<StockLog, Long> {
    @Query("""
            SELECT b.branchName AS branchName,
                SUM(CASE WHEN s.stockActionType = 'IN' THEN s.amount ELSE 0 END) AS inAmount,
                SUM(CASE WHEN s.stockActionType = 'OUT' THEN s.amount ELSE 0 END) AS outAmount,
                SUM(CASE WHEN s.stockActionType = 'LOSS' THEN s.amount ELSE 0 END) AS lossAmount
            FROM StockLog s
            JOIN s.branchId b
            WHERE FUNCTION('YEAR', s.actionDate) = :year AND FUNCTION('MONTH', s.actionDate) = :month
            GROUP BY b.branchName
        """)
    List<BranchStockBarChartProjection> findBranchStockSummary(
        @Param("year") int year,
        @Param("month") int month
    );

    @Query("""
            SELECT s.branchId.branchName AS branchName,
                   MONTH(s.actionDate) AS month,
                   SUM(CASE WHEN s.stockActionType = 'IN' THEN s.amount ELSE 0 END) AS inAmount,
                   SUM(CASE WHEN s.stockActionType = 'LOSS' THEN s.amount ELSE 0 END) AS lossAmount
            FROM StockLog s
            WHERE YEAR(s.actionDate) = :year
            GROUP BY s.branchId.branchName, MONTH(s.actionDate)
            ORDER BY s.branchId.branchName, MONTH(s.actionDate)
        """)
    List<TimeStockChartProjection> findTimeStockStatisticsByYear(Long year);

    @Query("""
            SELECT s.branchId.branchName AS branchName, COUNT(s) AS zeroStockCount
            FROM Stock s
            WHERE s.bookAmount = 0
            GROUP BY s.branchId.branchName
        """)
    List<ZeroStockProjection> findZeroStockStatics();

    @Query("""
            SELECT c.categoryName AS categoryName, SUM(sl.bookAmount) AS totalAmount
            FROM Stock sl
            JOIN sl.bookIsbn b
            JOIN b.categoryId c
            WHERE sl.branchId.branchName = :branchName
            GROUP BY c.categoryName
            ORDER BY SUM(sl.bookAmount) DESC
        """)
    List<CategoryStockProjection> findCategoryStockByBranch(@Param("branchName") String branchName);
}
