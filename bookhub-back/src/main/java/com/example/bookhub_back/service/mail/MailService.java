package com.example.bookhub_back.service.mail;

import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.auth.request.LoginIdFindSendEmailRequestDto;
import com.example.bookhub_back.dto.auth.request.PasswordFindSendEmailRequestDto;
import com.example.bookhub_back.dto.auth.request.PasswordResetRequestDto;
import com.example.bookhub_back.dto.employee.request.EmployeeSignUpUpdateRequestDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Mono;

public interface MailService {
    Mono<ResponseEntity<ResponseDto<String>>> sendEmailFindId(@Valid LoginIdFindSendEmailRequestDto dto);

    Mono<ResponseEntity<ResponseDto<String>>> verifyEmailId(String token);

    Mono<ResponseEntity<ResponseDto<String>>> sendEmailResetPassword(PasswordFindSendEmailRequestDto dto);

    Mono<ResponseEntity<ResponseDto<String>>> verifyLoginIdPassword(String token);

    Mono<ResponseEntity<ResponseDto<String>>> passwordChange(String token, PasswordResetRequestDto dto);

    Mono<ResponseEntity<ResponseDto<String>>> sendEmailSignUpResult(Long approvalId);

    Mono<ResponseEntity<ResponseDto<String>>> verifyEmployeeUpdate(String token);

    Mono<ResponseEntity<ResponseDto<String>>> employeeUpdate(String token, EmployeeSignUpUpdateRequestDto dto);
}
