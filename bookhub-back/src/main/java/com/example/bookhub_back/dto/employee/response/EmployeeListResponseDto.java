package com.example.bookhub_back.dto.employee.response;

import com.example.bookhub_back.common.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeListResponseDto {
    private Long employeeId;
    private Long employeeNumber;
    private String employeeName;
    private String branchName;
    private String positionName;
    private String authorityName;
    private Status status;
}
