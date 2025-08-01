package com.example.bookhub_back.repository.statistics;

import com.example.bookhub_back.dto.statistics.response.revenue.BranchRevenueResponseDto;
import com.example.bookhub_back.dto.statistics.response.revenue.WeeklyRevenueResponseDto;
import com.example.bookhub_back.entity.customer.CustomerOrder;
import com.example.bookhub_back.service.statistics.RevenueStatisticsService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RevenueStatisticsRepository extends JpaRepository<CustomerOrder,Long> {

    @Query("""
        SELECT new com.example.bookhub_back.dto.statistics.response.revenue.BranchRevenueResponseDto(
            b.branchId,
            b.branchName,
            cat.categoryName,
            SUM(d.price * d.amount)
        )
        FROM CustomerOrder o
        JOIN o.branchId b
        JOIN o.customerOrderDetails d
        JOIN d.book bk
        JOIN bk.categoryId cat
        WHERE FUNCTION('DATE', o.createdAt) BETWEEN :startDate AND :endDate
        GROUP BY b.branchId, b.branchName, cat.categoryName
        ORDER BY b.branchId
        """)
    List<BranchRevenueResponseDto> findByBranchByDate(
            @Param("startDate") LocalDate startDate,
            @Param("endDate")   LocalDate endDate
    );

    @Query(value = """
        SELECT
            DATE(co.customer_order_date_at) AS orderDate,
            SUM(co.customer_order_total_price) AS totalRevenue
        FROM customer_orders co
        LEFT JOIN refund_orders r
            ON r.order_id = co.customer_order_id
        WHERE YEAR(co.customer_order_date_at) = :year
            AND MONTH(co.customer_order_date_at) = :month
            AND r.order_id IS NULL
        GROUP BY DATE(co.customer_order_date_at)
        ORDER BY orderDate ASC;
""", nativeQuery = true)
    List<WeeklyRevenueResponseDto> findWeeklySales(
            @Param("year") int year,
            @Param("month") int month);
}

