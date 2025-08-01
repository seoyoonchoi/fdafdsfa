package com.example.bookhub_back.dto.statistics.response.revenue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
@Setter
public class WeeklyRevenueResponseDto {
    private Long branchId;
    private String branchName;
    private Integer weekIndex;
    private LocalDate weekStartDate;
    private Long totalRevenue;
}
