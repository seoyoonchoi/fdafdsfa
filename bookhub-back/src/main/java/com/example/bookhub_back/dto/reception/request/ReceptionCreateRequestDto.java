package com.example.bookhub_back.dto.reception.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReceptionCreateRequestDto {
    private Long branchId;
    private Long purchaseOrderApprovalId;
}
