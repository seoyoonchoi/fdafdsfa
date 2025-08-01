package com.example.bookhub_back.dto.employee.response;

import com.example.bookhub_back.common.enums.IsApproved;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeSignUpApprovalsResponseDto {
    private Long approvalId;
    private Long employeeNumber;
    private String employeeName;
    private Long authorizerNumber;
    private String authorizerName;
    private String appliedAt;
    private IsApproved isApproved;
    private String deniedReason;
    private String updatedAt;
}
