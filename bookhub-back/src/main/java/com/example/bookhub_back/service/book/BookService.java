package com.example.bookhub_back.service.book;

import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.book.request.BookCreateRequestDto;
import com.example.bookhub_back.dto.book.request.BookUpdateRequestDto;
import com.example.bookhub_back.dto.book.response.BookResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BookService {
    ResponseDto<BookResponseDto> createBook(BookCreateRequestDto dto, Long employeeId, MultipartFile coverImageFile) throws Exception;
    ResponseDto<BookResponseDto> updateBook(String isbn, BookUpdateRequestDto dto, Long employeeId, MultipartFile coverImageFile) throws Exception;
    ResponseDto<List<BookResponseDto>> searchBook(String keyword);
    ResponseDto<Void> hideBook(String isbn, Long employeeId);
}
