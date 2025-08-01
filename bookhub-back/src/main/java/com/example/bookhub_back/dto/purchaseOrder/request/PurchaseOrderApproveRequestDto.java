package com.example.bookhub_back.dto.purchaseOrder.request;

import com.example.bookhub_back.common.enums.PurchaseOrderStatus;
import lombok.Getter;

@Getter
public class PurchaseOrderApproveRequestDto {
    PurchaseOrderStatus status;
}
