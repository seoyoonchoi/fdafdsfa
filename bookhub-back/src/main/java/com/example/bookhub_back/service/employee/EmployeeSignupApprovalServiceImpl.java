package com.example.bookhub_back.service.employee;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessageKorean;
import com.example.bookhub_back.common.enums.IsApproved;
import com.example.bookhub_back.common.utils.DateUtils;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.employee.response.EmployeeSignUpApprovalsResponseDto;
import com.example.bookhub_back.entity.EmployeeSignUpApproval;
import com.example.bookhub_back.repository.EmployeeSignUpApprovalRepository;
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
public class EmployeeSignupApprovalServiceImpl implements EmployeeSignupApprovalService {
    private final EmployeeSignUpApprovalRepository employeeSignUpApprovalRepository;

    @Override
    public ResponseDto<PageResponseDto<EmployeeSignUpApprovalsResponseDto>> searchSignUpApproval(int page, int size, String employeeName, IsApproved isApproved, String deniedReason, String authorizerName, LocalDate startUpdatedAt, LocalDate endUpdatedAt) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EmployeeSignUpApproval> employeeSignUpApprovals = null;
        List<EmployeeSignUpApprovalsResponseDto> content = null;

        if ((startUpdatedAt != null && endUpdatedAt == null) || (startUpdatedAt == null && endUpdatedAt != null)) {
            throw new IllegalArgumentException("시작일과 종료일을 입력해주세요.");
        }

        if (startUpdatedAt != null) {
            LocalDateTime fromDateTime = startUpdatedAt.atStartOfDay();
            LocalDateTime toDateTime = endUpdatedAt.atTime(23, 59, 59);

            employeeSignUpApprovals = employeeSignUpApprovalRepository.searchSignUpApproval(
                employeeName, isApproved, deniedReason, authorizerName, fromDateTime, toDateTime, pageable);
        } else {
            employeeSignUpApprovals = employeeSignUpApprovalRepository.searchSignUpApproval(
                employeeName, isApproved, deniedReason, authorizerName, null, null, pageable);
        }

        content = employeeSignUpApprovals.stream()
            .map(employeeSignUpApproval -> EmployeeSignUpApprovalsResponseDto.builder()
                .approvalId(employeeSignUpApproval.getApprovalId())
                .employeeNumber(employeeSignUpApproval.getEmployeeId().getEmployeeNumber())
                .employeeName(employeeSignUpApproval.getEmployeeId().getName())
                .appliedAt(DateUtils.format(employeeSignUpApproval.getAppliedAt()))
                .isApproved(employeeSignUpApproval.getIsApproved())
                .deniedReason(employeeSignUpApproval.getDeniedReason())
                .authorizerNumber(employeeSignUpApproval.getAuthorizerId().getEmployeeNumber())
                .authorizerName(employeeSignUpApproval.getAuthorizerId().getName())
                .updatedAt(DateUtils.format(employeeSignUpApproval.getUpdatedAt()))
                .build())
            .collect(Collectors.toList());

        PageResponseDto<EmployeeSignUpApprovalsResponseDto> responseDtos = PageResponseDto.of(
            content,
            employeeSignUpApprovals.getTotalElements(),
            employeeSignUpApprovals.getTotalPages(),
            employeeSignUpApprovals.getNumber()
        );

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, responseDtos);
    }
}
