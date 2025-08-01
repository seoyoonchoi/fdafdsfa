package com.example.bookhub_back.service.employee;

import com.example.bookhub_back.common.enums.ExitReason;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.employee.response.EmployeeExitLogListResponseDto;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;

public interface EmployeeExitLogService {
    ResponseDto<PageResponseDto<EmployeeExitLogListResponseDto>> searchEmployeeExitLogs(@Min(0) int page, @Min(1) int size, String employeeName, String authorizerName, ExitReason exitReason, LocalDate startUpdatedAt, LocalDate endUpdatedAt);
}
