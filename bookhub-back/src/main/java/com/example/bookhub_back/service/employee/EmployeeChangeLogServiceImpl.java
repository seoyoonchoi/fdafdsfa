package com.example.bookhub_back.service.employee;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessageKorean;
import com.example.bookhub_back.common.enums.ChangeType;
import com.example.bookhub_back.common.utils.DateUtils;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.employee.response.EmployeeChangeLogListResponseDto;
import com.example.bookhub_back.entity.EmployeeChangeLog;
import com.example.bookhub_back.repository.EmployeeChangeLogRepository;
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
public class EmployeeChangeLogServiceImpl implements EmployeeChangeLogService {
    private final EmployeeChangeLogRepository employeeChangeLogRepository;

    @Override
    public ResponseDto<PageResponseDto<EmployeeChangeLogListResponseDto>> searchEmployeeChangeLogs(int page, int size, String employeeName, String authorizerName, ChangeType changeType, LocalDate startUpdatedAt, LocalDate endUpdatedAt) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EmployeeChangeLog> employeeChangeLogs = null;
        List<EmployeeChangeLogListResponseDto> content = null;

        if ((startUpdatedAt != null && endUpdatedAt == null) || (startUpdatedAt == null && endUpdatedAt != null)) {
            throw new IllegalArgumentException("시작일과 종료일을 입력해주세요.");
        }

        if (startUpdatedAt != null) {
            LocalDateTime fromDateTime = startUpdatedAt.atStartOfDay();
            LocalDateTime toDateTime = endUpdatedAt.atTime(23, 59, 59);

            employeeChangeLogs = employeeChangeLogRepository.searchEmployeeChangeLogs(employeeName, authorizerName, changeType, fromDateTime, toDateTime, pageable);
        } else {
            employeeChangeLogs = employeeChangeLogRepository.searchEmployeeChangeLogs(employeeName, authorizerName, changeType, null, null, pageable);
        }

        content = employeeChangeLogs.stream()
            .map(employeeChangeLog -> EmployeeChangeLogListResponseDto.builder()
                .logId(employeeChangeLog.getLogId())
                .employeeNumber(employeeChangeLog.getEmployeeId().getEmployeeNumber())
                .employeeName(employeeChangeLog.getEmployeeId().getName())
                .changeType(employeeChangeLog.getChangeType())
                .prePositionName(employeeChangeLog.getPreviousPositionId() != null
                    ? employeeChangeLog.getPreviousPositionId().getPositionName()
                    : null)
                .preAuthorityName(employeeChangeLog.getPreviousAuthorityId() != null
                    ? employeeChangeLog.getPreviousAuthorityId().getAuthorityName()
                    : null)
                .preBranchName(employeeChangeLog.getPreviousBranchId() != null
                    ? employeeChangeLog.getPreviousBranchId().getBranchName()
                    : null)
                .authorizerNumber(employeeChangeLog.getAuthorizerId().getEmployeeNumber())
                .authorizerName(employeeChangeLog.getAuthorizerId().getName())
                .updatedAt(DateUtils.format(employeeChangeLog.getChangedAt()))
                .build())
            .collect(Collectors.toList());

        PageResponseDto<EmployeeChangeLogListResponseDto> responseDtos = PageResponseDto.of(
            content,
            employeeChangeLogs.getTotalElements(),
            employeeChangeLogs.getTotalPages(),
            employeeChangeLogs.getNumber()
        );

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, responseDtos);
    }
}
