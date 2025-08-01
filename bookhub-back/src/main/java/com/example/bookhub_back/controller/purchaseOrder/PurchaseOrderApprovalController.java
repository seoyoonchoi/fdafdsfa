package com.example.bookhub_back.controller.purchaseOrder;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.purchaseOrder.response.PurchaseOrderApprovalResponseDto;
import com.example.bookhub_back.service.purchaseOrder.PurchaseOrderApprovalService;
import com.example.bookhub_back.service.purchaseOrder.PurchaseOrderService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping(ApiMappingPattern.ADMIN_API + "/purchase-order-approvals")
@RequiredArgsConstructor
public class PurchaseOrderApprovalController {
    private final PurchaseOrderApprovalService purchaseOrderApprovalService;

    @GetMapping
    public ResponseEntity<ResponseDto<PageResponseDto<PurchaseOrderApprovalResponseDto>>> searchPurchaseOrderApproval(
        @RequestParam(defaultValue = "0") @Min(0) int page,
        @RequestParam(defaultValue = "10") @Min(1) int size,
        @RequestParam(required = false) String employeeName,
        @RequestParam(required = false) Boolean isApproved,
        @RequestParam(required = false) LocalDate startUpdatedAt,
        @RequestParam(required = false) LocalDate endUpdatedAt
    ) {
        ResponseDto<PageResponseDto<PurchaseOrderApprovalResponseDto>> response = purchaseOrderApprovalService.searchPurchaseOrderApproval(page, size, employeeName, isApproved, startUpdatedAt, endUpdatedAt);
        return ResponseDto.toResponseEntity(HttpStatus.OK, response);
    }

}
