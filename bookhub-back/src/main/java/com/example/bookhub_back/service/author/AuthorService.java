package com.example.bookhub_back.service.author;

import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.author.request.AuthorCreateRequestDto;
import com.example.bookhub_back.dto.author.request.AuthorRequestDto;
import com.example.bookhub_back.dto.author.response.AuthorResponseDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

import java.util.List;

public interface AuthorService {
    ResponseDto<Void> checkDuplicateAuthorEmail(String authorEmail);

    ResponseDto<List<Void>> createAuthor(@Valid AuthorCreateRequestDto dto);

    ResponseDto<PageResponseDto<AuthorResponseDto>> getAllAuthorsByName(@Min(0) int page, @Min(1) int size, String authorName);

    ResponseDto<Void> updateAuthor(Long authorId, @Valid AuthorRequestDto dto);

    ResponseDto<Void> deleteAuthor(Long authorId);

}
