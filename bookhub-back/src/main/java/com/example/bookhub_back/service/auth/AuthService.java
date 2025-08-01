package com.example.bookhub_back.service.auth;

import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.auth.request.SignInRequestDto;
import com.example.bookhub_back.dto.auth.request.SignUpRequestDto;
import com.example.bookhub_back.dto.auth.response.SignInResponseDto;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

public interface AuthService {
    ResponseDto<Void> signUp(@Valid SignUpRequestDto dto);

    ResponseDto<SignInResponseDto> login(@Valid SignInRequestDto dto);

    ResponseDto<Void> checkLoginIdDuplicate(String loginId);

    ResponseDto<Void> checkEmailDuplicate(String email);

    ResponseDto<Void> checkPhoneNumberDuplicate(String phoneNumber);

    ResponseDto<Void> logout(HttpServletResponse response);
}
