package com.example.bookhub_back.service.book;

import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.book.response.BookLogResponseDto;
import com.example.bookhub_back.entity.Book;
import com.example.bookhub_back.entity.Employee;
import com.example.bookhub_back.entity.Policy;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookLogService {
    ResponseDto<PageResponseDto<BookLogResponseDto>> getBookLogs(String isbn, int page, int size);
    void logCreate(Book book, Employee employee);
    void logPriceChange(Book book, Long oldPrice, Employee employee);
    void logDiscountChange(Book book, Long oldRate, Policy policy, Employee employee);
    void logHidden(Book book, Employee employee);
    void logStatusChange(Book savedBook, Employee employee);
}
