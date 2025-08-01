package com.example.bookhub_back.dto.employee.request;

import com.example.bookhub_back.common.enums.IsApproved;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeSignUpApprovalRequestDto {
    @NotNull
    private IsApproved isApproved;
    private String deniedReason;
}
