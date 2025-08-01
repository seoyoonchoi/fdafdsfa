package com.example.bookhub_back.dto.statistics.response.revenue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
@AllArgsConstructor
@Setter
public class MonthlyRevenueResponseDto {
    private final Integer month;
    private final Long totalSales;
}
