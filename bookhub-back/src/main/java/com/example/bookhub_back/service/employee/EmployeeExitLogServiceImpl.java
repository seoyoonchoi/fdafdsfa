package com.example.bookhub_back.service.employee;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessageKorean;
import com.example.bookhub_back.common.enums.ExitReason;
import com.example.bookhub_back.common.utils.DateUtils;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.employee.response.EmployeeExitLogListResponseDto;
import com.example.bookhub_back.entity.EmployeeExitLog;
import com.example.bookhub_back.repository.EmployeeExitLogRepository;
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
public class EmployeeExitLogServiceImpl implements EmployeeExitLogService {
    private final EmployeeExitLogRepository employeeExitLogRepository;

    @Override
    public ResponseDto<PageResponseDto<EmployeeExitLogListResponseDto>> searchEmployeeExitLogs(int page, int size, String employeeName, String authorizerName, ExitReason exitReason, LocalDate startUpdatedAt, LocalDate endUpdatedAt) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EmployeeExitLog> employeeExitLogs = null;
        List<EmployeeExitLogListResponseDto> content = null;

        if ((startUpdatedAt != null && endUpdatedAt == null) || (startUpdatedAt == null && endUpdatedAt != null)) {
            throw new IllegalArgumentException("시작일과 종료일을 입력해주세요.");
        }

        if (startUpdatedAt != null) {
            LocalDateTime fromDateTime = startUpdatedAt.atStartOfDay();
            LocalDateTime toDateTime = endUpdatedAt.atTime(23, 59, 59);

            employeeExitLogs = employeeExitLogRepository.searchEmployeeExitLogs(employeeName, authorizerName, exitReason, fromDateTime, toDateTime, pageable);
        } else {
            employeeExitLogs = employeeExitLogRepository.searchEmployeeExitLogs(employeeName, authorizerName, exitReason, null, null, pageable);
        }

        content = employeeExitLogs.stream()
            .map(employeeExitLog -> EmployeeExitLogListResponseDto.builder()
                .exitId(employeeExitLog.getExitId())
                .employeeNumber(employeeExitLog.getEmployeeId().getEmployeeNumber())
                .employeeName(employeeExitLog.getEmployeeId().getName())
                .branchName(employeeExitLog.getEmployeeId().getBranchId().getBranchName())
                .positionName(employeeExitLog.getEmployeeId().getPositionId().getPositionName())
                .status(employeeExitLog.getEmployeeId().getStatus())
                .exitReason(employeeExitLog.getExitReason())
                .authorizerNumber(employeeExitLog.getAuthorizerId().getEmployeeNumber())
                .authorizerName(employeeExitLog.getAuthorizerId().getName())
                .updatedAt(DateUtils.format(employeeExitLog.getExitAt()))
                .build())
            .collect(Collectors.toList());

        PageResponseDto<EmployeeExitLogListResponseDto> responseDtos = PageResponseDto.of(
            content,
            employeeExitLogs.getTotalElements(),
            employeeExitLogs.getTotalPages(),
            employeeExitLogs.getNumber()
        );

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, responseDtos);
    }
}
