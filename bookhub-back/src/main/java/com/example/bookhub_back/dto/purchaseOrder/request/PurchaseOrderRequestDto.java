package com.example.bookhub_back.dto.purchaseOrder.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PurchaseOrderRequestDto {
    @NotBlank
    private String isbn;
    @NotNull
    private int purchaseOrderAmount;


}
