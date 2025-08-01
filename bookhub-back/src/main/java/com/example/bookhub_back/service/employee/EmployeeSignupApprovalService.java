package com.example.bookhub_back.service.employee;

import com.example.bookhub_back.common.enums.IsApproved;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.employee.response.EmployeeSignUpApprovalsResponseDto;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;
import java.util.List;

public interface EmployeeSignupApprovalService {
    ResponseDto<PageResponseDto<EmployeeSignUpApprovalsResponseDto>> searchSignUpApproval(@Min(0) int page, @Min(1) int size, String employeeName, IsApproved isApproved, String deniedReason, String authorizerName, LocalDate startUpdatedAt, LocalDate endUpdatedAt);
}
