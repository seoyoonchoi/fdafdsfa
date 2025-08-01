package com.example.bookhub_back.controller.employee;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.common.enums.IsApproved;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.employee.response.EmployeeSignUpApprovalsResponseDto;
import com.example.bookhub_back.service.employee.EmployeeSignupApprovalService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping(ApiMappingPattern.ADMIN_API + "/employee-signup-approvals")
@RequiredArgsConstructor
public class EmployeeSignUpApprovalController {
    private final EmployeeSignupApprovalService employeeSignupApprovalService;

    @GetMapping
    public ResponseEntity<ResponseDto<PageResponseDto<EmployeeSignUpApprovalsResponseDto>>> searchSignUpApproval(
        @RequestParam(defaultValue = "0") @Min(0) int page,
        @RequestParam(defaultValue = "10") @Min(1) int size,
        @RequestParam(required = false) String employeeName,
        @RequestParam(required = false) IsApproved isApproved,
        @RequestParam(required = false) String deniedReason,
        @RequestParam(required = false) String authorizerName,
        @RequestParam(required = false) LocalDate startUpdatedAt,
        @RequestParam(required = false) LocalDate endUpdatedAt
    ) {
        ResponseDto<PageResponseDto<EmployeeSignUpApprovalsResponseDto>> responseDto = employeeSignupApprovalService.searchSignUpApproval(
            page, size, employeeName, isApproved, deniedReason, authorizerName, startUpdatedAt, endUpdatedAt);
        return ResponseDto.toResponseEntity(HttpStatus.OK, responseDto);
    }
}