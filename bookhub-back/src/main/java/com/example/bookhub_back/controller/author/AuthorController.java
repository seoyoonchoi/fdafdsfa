package com.example.bookhub_back.controller.author;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.author.request.AuthorCreateRequestDto;
import com.example.bookhub_back.dto.author.request.AuthorRequestDto;
import com.example.bookhub_back.dto.author.response.AuthorResponseDto;
import com.example.bookhub_back.service.author.AuthorService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiMappingPattern.ADMIN_API + "/authors")
@RequiredArgsConstructor
public class AuthorController {
    private final AuthorService authorService;

    @GetMapping("/email-exists")
    public ResponseEntity<ResponseDto<Void>> checkDuplicateAuthorEmail(@RequestParam String authorEmail) {
        ResponseDto<Void> responseDto = authorService.checkDuplicateAuthorEmail(authorEmail);
        return ResponseDto.toResponseEntity(HttpStatus.OK, responseDto);
    }

    @PostMapping
    public ResponseEntity<ResponseDto<List<Void>>> createAuthor(@Valid @RequestBody AuthorCreateRequestDto dto) {
        ResponseDto<List<Void>> responseDto = authorService.createAuthor(dto);
        return ResponseDto.toResponseEntity(HttpStatus.CREATED, responseDto);
    }

    @GetMapping
    public ResponseEntity<ResponseDto<PageResponseDto<AuthorResponseDto>>> getAllAuthorsByName(
        @RequestParam(defaultValue = "0") @Min(0) int page,
        @RequestParam(defaultValue = "10") @Min(1) int size,
        @RequestParam(required = false) String authorName
    ) {
        ResponseDto<PageResponseDto<AuthorResponseDto>> responseDto = authorService.getAllAuthorsByName(page, size, authorName);
        return ResponseDto.toResponseEntity(HttpStatus.OK, responseDto);
    }

    @PutMapping("/{authorId}")
    public ResponseEntity<ResponseDto<Void>> updateAuthor(
        @PathVariable Long authorId,
        @Valid @RequestBody AuthorRequestDto dto
    ) {
        ResponseDto<Void> responseDto = authorService.updateAuthor(authorId, dto);
        return ResponseDto.toResponseEntity(HttpStatus.OK, responseDto);
    }

    @DeleteMapping("/{authorId}")
    public ResponseEntity<ResponseDto<Void>> deleteAuthor(@PathVariable Long authorId) {
        ResponseDto<Void> responseDto = authorService.deleteAuthor(authorId);
        return ResponseDto.toResponseEntity(HttpStatus.OK, responseDto);
    }

}
