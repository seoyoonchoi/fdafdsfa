package com.example.bookhub_back.dto.book.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookLogResponseDto {
    private Long bookLogId;
    private String bookIsbn;
    private String bookTitle;
    private String bookLogType;
    private Long previousPrice;
    private Long previousDiscountRate;
    private String employeeName;
    private Long policyId;
    private LocalDateTime changedAt;
}
