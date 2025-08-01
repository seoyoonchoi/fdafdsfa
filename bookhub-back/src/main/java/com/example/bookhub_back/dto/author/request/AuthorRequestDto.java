package com.example.bookhub_back.dto.author.request;

import com.example.bookhub_back.common.constants.RegexConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class AuthorRequestDto {
    @NotBlank
    private String authorName;

    @NotBlank(message = "이메일은 필수입니다.")
    @Pattern(regexp = RegexConstants.EMAIL_REGEX, message = "이메일 형식이 아닙니다.")
    private String authorEmail;
}
