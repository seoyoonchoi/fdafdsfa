package com.example.bookhub_back.dto.auth.request;

import com.example.bookhub_back.common.constants.RegexConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequestDto {
    @NotBlank(message = "아이디는 필수입니다.")
    @Pattern(regexp = RegexConstants.LOING_ID_REGEX, message = "아이디는 4~12자의 영어와 숫자만 사용해야 합니다.")
    private String loginId;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Pattern(regexp = RegexConstants.PASSWORD_REGEX, message = "비밀번호는 8~16자의 영어, 숫자, 특수문자 각각 하나 이상 포함되어야 합니다.")
    private String password;

    @NotBlank(message = "비밀번호 확인은 필수입니다.")
    private String confirmPassword;

    @NotBlank(message = "이름은 필수입니다.")
    private String name;

    @NotBlank(message = "이메일은 필수입니다.")
    @Pattern(regexp = RegexConstants.EMAIL_REGEX, message = "이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "전화번호는 필수입니다.")
    @Pattern(regexp = RegexConstants.PHONE_REGEX, message = "휴대폰 번호는 010으로 사작하고 8자리여야 합니다.")
    private String phoneNumber;

    @NotNull
    private LocalDate birthDate;

    @NotNull
    private  Long branchId;
}
