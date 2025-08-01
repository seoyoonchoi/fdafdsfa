package com.example.bookhub_back.dto.employee.response;

import com.example.bookhub_back.common.enums.ChangeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeChangeLogListResponseDto {
    private Long logId;
    private Long employeeNumber;
    private String employeeName;
    private ChangeType changeType;
    private String prePositionName;
    private String preAuthorityName;
    private String preBranchName;
    private Long authorizerNumber;
    private String authorizerName;
    private String updatedAt;
}
