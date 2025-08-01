package com.example.bookhub_back.dto.reception.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReceptionListResponseDto {
    private Long bookReceptionApprovalId;
    private String bookIsbn;
    private String bookTitle;
    private String branchName;
    private int purchaseOrderAmount;
    private Boolean isReceptionApproved;
    private LocalDateTime receptionDateAt;
    private String receptionEmployeeName;
}
