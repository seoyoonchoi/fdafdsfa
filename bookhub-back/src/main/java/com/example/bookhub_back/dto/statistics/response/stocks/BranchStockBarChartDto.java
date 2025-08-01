package com.example.bookhub_back.dto.statistics.response.stocks;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BranchStockBarChartDto {
    private String branchName;
    private Long inAmount;
    private Long outAmount;
    private Long lossAmount;
}
