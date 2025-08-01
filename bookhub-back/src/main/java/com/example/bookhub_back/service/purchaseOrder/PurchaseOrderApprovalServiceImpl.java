package com.example.bookhub_back.service.purchaseOrder;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessage;
import com.example.bookhub_back.common.utils.DateUtils;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.purchaseOrder.response.PurchaseOrderApprovalResponseDto;
import com.example.bookhub_back.entity.PurchaseOrderApproval;
import com.example.bookhub_back.repository.EmployeeRepository;
import com.example.bookhub_back.repository.PurchaseOrderApprovalRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseOrderApprovalServiceImpl implements PurchaseOrderApprovalService {
    private final PurchaseOrderApprovalRepository purchaseOrderApprovalRepository;

    @Override
    public ResponseDto<PageResponseDto<PurchaseOrderApprovalResponseDto>> searchPurchaseOrderApproval(int page, int size, String employeeName, Boolean isApproved, LocalDate startUpdatedAt, LocalDate endUpdatedAt) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PurchaseOrderApproval> purchaseOrderApprovals = null;
        List<PurchaseOrderApprovalResponseDto> content = null;

        if ((startUpdatedAt != null && endUpdatedAt == null) || (startUpdatedAt == null && endUpdatedAt != null)) {
            throw new IllegalArgumentException("시작일과 종료일을 입력해주세요.");
        }

        if (startUpdatedAt != null) {
            LocalDateTime fromDateTime = startUpdatedAt.atStartOfDay();
            LocalDateTime toDateTime = endUpdatedAt.atTime(23, 59, 59);

            purchaseOrderApprovals = purchaseOrderApprovalRepository.searchPurchaseOrderApproval(employeeName, isApproved, fromDateTime, toDateTime, pageable);
        } else {
            purchaseOrderApprovals = purchaseOrderApprovalRepository.searchPurchaseOrderApproval(employeeName, isApproved, null, null, pageable);
        }

        content = purchaseOrderApprovals.stream()
            .map(purchaseOrderApproval -> changeToResponseDto(purchaseOrderApproval))
            .collect(Collectors.toList());

        PageResponseDto<PurchaseOrderApprovalResponseDto> responseDtos = PageResponseDto.of(
            content,
            purchaseOrderApprovals.getTotalElements(),
            purchaseOrderApprovals.getTotalPages(),
            purchaseOrderApprovals.getNumber()
        );

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDtos);
    }

    public PurchaseOrderApprovalResponseDto changeToResponseDto(PurchaseOrderApproval purchaseOrderApproval) {
        return PurchaseOrderApprovalResponseDto.builder()
            .purchaseOrderApprovalId(purchaseOrderApproval.getPurchaseOrderApprovalId())
            .poDetail(
                PurchaseOrderApprovalResponseDto.PurchaseOrderDetail.builder()
                    .branchName(purchaseOrderApproval.getPurchaseOrderId().getBranchId().getBranchName())
                    .employeeName(purchaseOrderApproval.getPurchaseOrderId().getEmployeeId().getName())
                    .isbn(purchaseOrderApproval.getPurchaseOrderId().getBookIsbn().getIsbn())
                    .bookTitle(purchaseOrderApproval.getPurchaseOrderId().getBookIsbn().getBookTitle())
                    .bookPrice(purchaseOrderApproval.getPurchaseOrderId().getBookIsbn().getBookPrice())
                    .purchaseOrderAmount(purchaseOrderApproval.getPurchaseOrderId().getPurchaseOrderAmount())
                    .purchaseOrderStatus(purchaseOrderApproval.getPurchaseOrderId().getPurchaseOrderStatus())
                    .build()
            )
            .employeeName(purchaseOrderApproval.getEmployeeId().getName())
            .isApproved(purchaseOrderApproval.isApproved())
            .approvedDateAt(DateUtils.format(purchaseOrderApproval.getCreatedAt()))
            .build();
    }
}
