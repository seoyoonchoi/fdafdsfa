package com.example.bookhub_back.dto.author.request;

import com.example.bookhub_back.common.constants.RegexConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

import java.util.List;

@Getter
public class AuthorCreateRequestDto {
    @NotEmpty
    private List<AuthorRequestDto> authors;
}
