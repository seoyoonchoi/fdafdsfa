package com.example.bookhub_back.dto.stock.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StockResponseDto {
    private Long stockId;
    private String type;
    private Long branchId;
    private String branchName;
    private String bookIsbn;
    private String bookTitle;
    private Long amount;
    private Long bookAmount;
}
