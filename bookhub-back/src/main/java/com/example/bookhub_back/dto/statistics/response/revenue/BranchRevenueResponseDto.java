package com.example.bookhub_back.dto.statistics.response.revenue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
@AllArgsConstructor
@Setter
public class BranchRevenueResponseDto {
    private Long branchId;
    private String branchName;
    private String categoryName;
    private Long totalRevenue;
}
