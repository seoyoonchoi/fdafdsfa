package com.example.bookhub_back.dto.auth.request;

import com.example.bookhub_back.common.constants.RegexConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordFindSendEmailRequestDto {
    @NotBlank(message = "아이디는 필수입니다.")
    @Pattern(regexp = RegexConstants.LOING_ID_REGEX, message = "아이디는 4~12자의 영어와 숫자만 사용해야 합니다.")
    private String loginId;

    @NotBlank(message = "이메일은 필수입니다.")
    @Pattern(regexp = RegexConstants.EMAIL_REGEX, message = "이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "전화번호는 필수입니다.")
    @Pattern(regexp = RegexConstants.PHONE_REGEX, message = "휴대폰 번호는 010으로 시작하고 뒤에는 8자리로 이루어져야 합니다.")
    private String phoneNumber;
}