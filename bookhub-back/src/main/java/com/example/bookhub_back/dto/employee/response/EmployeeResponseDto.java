package com.example.bookhub_back.dto.employee.response;

import com.example.bookhub_back.common.enums.IsApproved;
import com.example.bookhub_back.common.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeResponseDto {
    private Long employeeId;
    private Long employeeNumber;
    private String employeeName;
    private Long branchId;
    private String branchName;
    private Long positionId;
    private String positionName;
    private Long authorityId;
    private String authorityName;
    private String email;
    private String phoneNumber;
    private LocalDate birthDate;
    private Status status;
    private IsApproved isApproved;
    private String createdAt;
}
