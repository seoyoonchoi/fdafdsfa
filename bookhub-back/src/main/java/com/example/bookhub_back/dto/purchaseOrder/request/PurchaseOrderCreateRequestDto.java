package com.example.bookhub_back.dto.purchaseOrder.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class PurchaseOrderCreateRequestDto {
    @NotEmpty
    List<PurchaseOrderRequestDto> purchaseOrders;
}

