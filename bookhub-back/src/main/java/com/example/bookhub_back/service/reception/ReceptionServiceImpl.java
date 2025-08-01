package com.example.bookhub_back.service.reception;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessage;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.alert.request.AlertCreateRequestDto;
import com.example.bookhub_back.dto.reception.request.ReceptionCreateRequestDto;
import com.example.bookhub_back.dto.reception.response.ReceptionCreateResponseDto;
import com.example.bookhub_back.dto.reception.response.ReceptionListResponseDto;
import com.example.bookhub_back.dto.stock.request.StockUpdateRequestDto;
import com.example.bookhub_back.entity.*;
import com.example.bookhub_back.provider.JwtTokenProvider;
import com.example.bookhub_back.repository.*;
import com.example.bookhub_back.service.alert.AlertService;
import com.example.bookhub_back.service.stock.StockService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceptionServiceImpl implements ReceptionService {
    private final JwtTokenProvider jwtTokenProvider;
    private final EmployeeRepository employeeRepository;
    private final ReceptionRepository receptionRepository;
    private final BranchRepository branchRepository;
    private final PurchaseOrderApprovalRepository purchaseOrderApprovalRepository;
    private final StockService stockService;
    private final AlertService alertService;
    private final AuthorityRepository authorityRepository;

    @Override
    @Transactional
    public ResponseDto<ReceptionCreateResponseDto> createReception(ReceptionCreateRequestDto dto, Long branchId) {

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 지점입니다."));

        PurchaseOrderApproval purchaseOrderApproval = purchaseOrderApprovalRepository.findById(dto.getPurchaseOrderApprovalId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 발주 승인 입니다."));

        Reception reception = Reception.builder()
                .bookIsbn(purchaseOrderApproval.getPurchaseOrderId().getBookIsbn().getIsbn())
                .receptionEmployeeId(null)
                .branchName(branch.getBranchName())
                .bookTitle(purchaseOrderApproval.getPurchaseOrderId().getBookIsbn().getBookTitle())
                .purchaseOrderAmount(purchaseOrderApproval.getPurchaseOrderId().getPurchaseOrderAmount())
                .isReceptionApproved(false)
                .receptionDateAt(null)
                .purchaseOrderApprovalId(purchaseOrderApproval)
                .build();

        Reception newReception = receptionRepository.save(reception);

        ReceptionCreateResponseDto responseDto = ReceptionCreateResponseDto.builder()
                .receptionId(newReception.getBookReceptionApprovalId())
                .branchName(newReception.getBranchName())
                .bookIsbn(newReception.getBookIsbn())
                .bookTitle(newReception.getBookTitle())
                .purchaseOrderAmount(newReception.getPurchaseOrderAmount())
                .build();
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto);
    }

    @Override
    @Transactional
    public ResponseDto<Void> approveReception(Long id, Long employeeId) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

        Reception reception = receptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 데이터입니다."));

        reception.setIsReceptionApproved(true);
        reception.setReceptionEmployeeId(employee);
        reception.setReceptionDateAt(LocalDateTime.now());
        StockUpdateRequestDto stockUpdateRequestDto = StockUpdateRequestDto.builder()
                .type("IN")
                .employeeId(employee.getEmployeeId())
                .bookIsbn(reception.getBookIsbn())
                .branchId(reception.getPurchaseOrderApprovalId().getPurchaseOrderId().getBranchId().getBranchId())
                .amount((long) reception.getPurchaseOrderAmount())
                .description("입고-수령확인")
                .build();

        Authority adminAuthority = authorityRepository.findByAuthorityName("ADMIN")
                .orElseThrow(() -> new IllegalArgumentException(ResponseMessage.USER_NOT_FOUND));

        for (Employee admin : employeeRepository.findAll().stream()
                .filter(emp -> emp.getAuthorityId().equals(adminAuthority))
                .toList()) {
            alertService.createAlert(AlertCreateRequestDto.builder()
                    .employeeId(admin.getEmployeeId())
                    .alertType("BOOK_RECEIVED_SUCCESS")
                    .alertTargetTable("BOOK_RECEPTION_APPROVALS")
                    .targetPk(reception.getBookReceptionApprovalId())
                    .message("지점 " + reception.getBranchName() +
                            "에서 [" + reception.getBookTitle() + "] 수령 확정 되었습니다.")
                    .build());
        }
        stockService.updateStock(null, null, stockUpdateRequestDto);
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    @Override
    public ResponseDto<PageResponseDto<ReceptionListResponseDto>> getPendingList(String loginId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Reception> pendingList = receptionRepository.findPendingByLoginId(loginId, pageable);
        List<ReceptionListResponseDto> result = pendingList.getContent().stream()
                .map(r -> ReceptionListResponseDto.builder()
                        .bookReceptionApprovalId(r.getBookReceptionApprovalId())
                        .bookIsbn(r.getBookIsbn())
                        .bookTitle(r.getBookTitle())
                        .branchName(r.getBranchName())
                        .purchaseOrderAmount(r.getPurchaseOrderAmount())
                        .isReceptionApproved(r.getIsReceptionApproved())
                        .receptionDateAt(r.getReceptionDateAt())
                        .receptionEmployeeName(null)
                        .build())
                .toList();
        PageResponseDto<ReceptionListResponseDto> pageResponse = PageResponseDto.of(
                result,
                pendingList.getTotalElements(),
                pendingList.getTotalPages(),
                pendingList.getNumber()
        );
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, pageResponse);
    }

    @Override
    public ResponseDto<PageResponseDto<ReceptionListResponseDto>> getManagerConfirmedList(
            String loginId, int page, int size, String startDate, String endDate) {

        Pageable pageable = PageRequest.of(page, size);
        LocalDateTime start = null, end = null;
        if (startDate != null && !startDate.isEmpty()) {
            start = LocalDate.parse(startDate).atStartOfDay();
        }
        if (endDate != null && !endDate.isEmpty()) {
            end = LocalDate.parse(endDate).atTime(23, 59, 59);
        }
        Page<Reception> confirmedList = receptionRepository.findAllConfirmedByLoginId(loginId, start, end, pageable);
        List<ReceptionListResponseDto> result = confirmedList.stream()
                .map(r -> ReceptionListResponseDto.builder()
                        .bookReceptionApprovalId(r.getBookReceptionApprovalId())
                        .bookIsbn(r.getBookIsbn())
                        .bookTitle(r.getBookTitle())
                        .branchName(r.getBranchName())
                        .purchaseOrderAmount(r.getPurchaseOrderAmount())
                        .receptionDateAt(r.getReceptionDateAt())
                        .isReceptionApproved(r.getIsReceptionApproved())
                        .receptionEmployeeName(r.getReceptionEmployeeId().getName())
                        .build())
                .toList();
        PageResponseDto<ReceptionListResponseDto> pageResponse = PageResponseDto.of(
                result,
                confirmedList.getTotalElements(),
                confirmedList.getTotalPages(),
                confirmedList.getNumber()
        );
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, pageResponse);
    }

    @Override
    public ResponseDto<PageResponseDto<ReceptionListResponseDto>> getAdminConfirmedList(String branchName, String isbn, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Reception> logs = receptionRepository.findAllConfirmedLogsWithFilter(
                branchName == null ? null : branchName.trim(),
                isbn == null ? null : isbn.trim(),
                pageable
        );
        List<ReceptionListResponseDto> result = logs.stream()
                .map(r -> ReceptionListResponseDto.builder()
                        .bookReceptionApprovalId(r.getBookReceptionApprovalId())
                        .bookIsbn(r.getBookIsbn())
                        .bookTitle(r.getBookTitle())
                        .branchName(r.getBranchName())
                        .purchaseOrderAmount(r.getPurchaseOrderAmount())
                        .isReceptionApproved(r.getIsReceptionApproved())
                        .receptionDateAt(r.getReceptionDateAt())
                        .receptionEmployeeName(r.getReceptionEmployeeId().getName())
                        .build())
                .toList();
        PageResponseDto<ReceptionListResponseDto> pageResponse = PageResponseDto.of(
                result,
                logs.getTotalElements(),
                logs.getTotalPages(),
                logs.getNumber()
        );
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, pageResponse);
    }
}
