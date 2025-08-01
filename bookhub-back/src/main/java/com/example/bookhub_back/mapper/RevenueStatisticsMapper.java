package com.example.bookhub_back.mapper;

import com.example.bookhub_back.dto.statistics.response.revenue.MonthlyRevenueResponseDto;
import com.example.bookhub_back.dto.statistics.response.revenue.WeekdayRevenueResponseDto;
import com.example.bookhub_back.dto.statistics.response.revenue.WeeklyRevenueResponseDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Mapper
public interface RevenueStatisticsMapper {
    @Select("""
            SELECT
                CASE DAYOFWEEK(co.customer_order_date_at)
            WHEN 1 THEN '일' WHEN 2 THEN '월' WHEN 3 THEN '화' WHEN 4 THEN '수' WHEN 5 THEN '목' WHEN 6 THEN '금' WHEN 7 THEN '토' 
            END AS weekday,
                COALESCE(SUM(co.customer_order_total_price),0) AS total
            FROM customer_orders co 
            WHERE YEAR(co.customer_order_date_at) = #{year}
            AND MONTH(co.customer_order_date_at) BETWEEN #{startMonth} and #{endMonth}
            GROUP BY weekday
            ORDER BY FIELD(weekday, '월','화','수','목','금','토','일')
            """
    )
    List<WeekdayRevenueResponseDto> findRevenueGroupedByWeekday(
            @Param("year") int year,
            @Param("startMonth") int startMonth,
            @Param("endMonth") int endMonth

    );

    @Select("""
SELECT
    MONTH(co.customer_order_date_at)AS orderMonth,
    SUM(co.customer_order_total_price) AS totalRevenue
FROM customer_orders co
LEFT JOIN refund_orders r
ON r.order_id = co.customer_order_id
WHERE YEAR(co.customer_order_date_at) = :year
AND r.order_id IS NULL
GROUP BY MONTH (co.customer_order_date_at)
ORDER BY MONTH (co.customer_order_date_at) ASC;

""")
    List<MonthlyRevenueResponseDto> findMonthlySales(@Param("year") int year);
}


