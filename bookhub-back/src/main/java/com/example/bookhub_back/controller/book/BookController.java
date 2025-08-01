package com.example.bookhub_back.controller.book;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.book.request.BookCreateRequestDto;
import com.example.bookhub_back.dto.book.request.BookUpdateRequestDto;
import com.example.bookhub_back.dto.book.response.BookResponseDto;
import com.example.bookhub_back.security.auth.EmployeePrincipal;
import com.example.bookhub_back.service.book.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;

    @PostMapping(ApiMappingPattern.ADMIN_API + "/books")
    public ResponseEntity<ResponseDto<BookResponseDto>> createBook(
            @AuthenticationPrincipal EmployeePrincipal employeePrincipal,
            @RequestPart("dto") BookCreateRequestDto dto,
            @RequestPart(value = "coverImageFile", required = false) MultipartFile coverImageFile) throws Exception {
        Long employeeId = employeePrincipal.getEmployeeId();
        ResponseDto<BookResponseDto> book = bookService.createBook(dto, employeeId, coverImageFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(book);
    }

    @PutMapping(ApiMappingPattern.ADMIN_API + "/books/{isbn}")
    public ResponseDto<BookResponseDto> updateBook(
            @AuthenticationPrincipal EmployeePrincipal employeePrincipal,
            @PathVariable String isbn,
            @RequestPart BookUpdateRequestDto dto,
            @RequestPart(value = "file", required = false) MultipartFile newCoverImageFile) throws Exception {
        Long employeeId = employeePrincipal.getEmployeeId();
        return bookService.updateBook(isbn, dto, employeeId, newCoverImageFile);
    }

    @PutMapping(ApiMappingPattern.ADMIN_API + "/books/hidden/{isbn}")
    public ResponseDto<Void> hideBook(
            @AuthenticationPrincipal EmployeePrincipal employeePrincipal,
            @PathVariable String isbn) {
        Long employeeId = employeePrincipal.getEmployeeId();
        return bookService.hideBook(isbn, employeeId);
    }

    @GetMapping(ApiMappingPattern.COMMON_API + "/books/search")
    public ResponseDto<List<BookResponseDto>> searchBook(
            @RequestParam String keyword) {
        return bookService.searchBook(keyword);
    }
}
