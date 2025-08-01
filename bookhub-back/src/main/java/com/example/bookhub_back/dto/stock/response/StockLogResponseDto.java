package com.example.bookhub_back.dto.stock.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class StockLogResponseDto {
    private Long stockLogId;
    private String type;
    private String employeeName;
    private String bookTitle;
    private String branchName;
    private Long amount;
    private Long bookAmount;
    private LocalDate actionDate;
    private String description;
}
