package com.example.bookhub_back.controller.purchaseOrder;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.purchaseOrder.request.PurchaseOrderApproveRequestDto;
import com.example.bookhub_back.dto.purchaseOrder.response.PurchaseOrderResponseDto;
import com.example.bookhub_back.service.purchaseOrder.PurchaseOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping(ApiMappingPattern.ADMIN_API+"/purchase-order-approvals")
@RequiredArgsConstructor
public class PurchaseOrderAdminController {

    private final PurchaseOrderService purchaseOrderService;
    @GetMapping("/requested")
    public ResponseEntity<ResponseDto<List<PurchaseOrderResponseDto>>> getAllPurchaseOrdersRequested() {
        ResponseDto<List<PurchaseOrderResponseDto>> response = purchaseOrderService.getAllPurchaseOrdersRequested();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/approval/{purchaseOrderId}")
    public ResponseEntity<ResponseDto<PurchaseOrderResponseDto>> approvePurchaseOrder(
            @AuthenticationPrincipal String loginId,
            @PathVariable Long purchaseOrderId,
            @RequestBody PurchaseOrderApproveRequestDto dto
    ){
        ResponseDto<PurchaseOrderResponseDto> response = purchaseOrderService.approvePurchaseOrder(loginId, purchaseOrderId, dto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
