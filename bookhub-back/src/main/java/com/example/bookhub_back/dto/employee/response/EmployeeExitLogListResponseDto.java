package com.example.bookhub_back.dto.employee.response;

import com.example.bookhub_back.common.enums.ExitReason;
import com.example.bookhub_back.common.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeExitLogListResponseDto {
    private Long exitId;
    private Long employeeNumber;
    private String employeeName;
    private String branchName;
    private String positionName;
    private Status status;
    private ExitReason exitReason;
    private Long authorizerNumber;
    private String authorizerName;
    private String updatedAt;
}
