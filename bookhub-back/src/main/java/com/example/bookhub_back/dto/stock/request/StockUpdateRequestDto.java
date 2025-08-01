package com.example.bookhub_back.dto.stock.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StockUpdateRequestDto {
    private String type;
    private Long employeeId;
    private String bookIsbn;
    private Long branchId;
    private Long amount;
    private String description;
}
