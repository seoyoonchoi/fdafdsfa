package com.example.bookhub_back.dto.statistics.response.stocks;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeStockChartResponseDto {
    private String branchName;
    private Long month;
    private Long inAmount;
    private Long lossAmount;
}