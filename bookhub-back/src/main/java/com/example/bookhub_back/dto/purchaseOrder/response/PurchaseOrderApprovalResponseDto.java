package com.example.bookhub_back.dto.purchaseOrder.response;

import com.example.bookhub_back.common.enums.PurchaseOrderStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrderApprovalResponseDto {
    private Long purchaseOrderApprovalId;
    @JsonProperty("isApproved")
    private boolean isApproved;
    private String approvedDateAt;
    private String employeeName; // 승인한 담당자 이름
    private PurchaseOrderDetail poDetail;

    @Getter
    @Builder
    @AllArgsConstructor
    public static class PurchaseOrderDetail {
        private String branchName;
        private String employeeName;
        private String isbn;
        private String bookTitle;
        private Long bookPrice;
        private int purchaseOrderAmount;
        private PurchaseOrderStatus purchaseOrderStatus;
    }
}
