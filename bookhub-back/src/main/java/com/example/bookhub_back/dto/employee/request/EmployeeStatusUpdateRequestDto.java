package com.example.bookhub_back.dto.employee.request;

import com.example.bookhub_back.common.enums.ExitReason;
import com.example.bookhub_back.common.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeStatusUpdateRequestDto {
    @NotNull
    private Status status;
    @NotNull
    private ExitReason exitReason;
}
