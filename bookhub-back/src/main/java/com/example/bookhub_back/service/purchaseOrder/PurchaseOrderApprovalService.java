package com.example.bookhub_back.service.purchaseOrder;

import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.purchaseOrder.response.PurchaseOrderApprovalResponseDto;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;

public interface PurchaseOrderApprovalService {
    ResponseDto<PageResponseDto<PurchaseOrderApprovalResponseDto>> searchPurchaseOrderApproval(@Min(0) int page, @Min(1) int size, String employeeName, Boolean isApproved, LocalDate startUpdatedAt, LocalDate endUpdatedAt);
}
