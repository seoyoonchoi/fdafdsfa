package com.example.bookhub_back.dto.auth.response;

import com.example.bookhub_back.dto.employee.response.EmployeeResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignInResponseDto {
    private String token;
    private int exprTime;
    private EmployeeResponseDto employee;
}
