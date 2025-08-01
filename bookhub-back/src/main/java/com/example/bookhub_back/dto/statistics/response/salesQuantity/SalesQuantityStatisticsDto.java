package com.example.bookhub_back.dto.statistics.response.salesQuantity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SalesQuantityStatisticsDto {
    Long totalSales;
    LocalDateTime orderDate;
    Integer orderMonth;
    String categoryName;
    String policyTitle;
    String branchName;
}
