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
public class SignInRequestDto {
    @NotBlank(message = "아이디는 필수입니다.")
    @Pattern(regexp = RegexConstants.LOING_ID_REGEX, message = "아이디는 4~12자의 영어와 숫자만 사용해야 합니다.")
    private String loginId;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Pattern(regexp = RegexConstants.PASSWORD_REGEX, message = "비밀번호는 8~16자의 영어, 숫자, 특수문자 각각 하나 이상 포함되어야 합니다.")
    private String password;
}
