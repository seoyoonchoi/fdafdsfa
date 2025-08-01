package com.example.bookhub_back.service.book;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessage;
import com.example.bookhub_back.common.enums.BookLogType;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.book.response.BookLogResponseDto;
import com.example.bookhub_back.entity.Book;
import com.example.bookhub_back.entity.BookLog;
import com.example.bookhub_back.entity.Employee;
import com.example.bookhub_back.entity.Policy;
import com.example.bookhub_back.repository.BookLogRepository;
import com.example.bookhub_back.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookLogServiceImpl implements BookLogService {
    private final BookLogRepository bookLogRepository;
    private final BookRepository bookrepository;

    @Override
    public ResponseDto<PageResponseDto<BookLogResponseDto>> getBookLogs(String isbn, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BookLog> logs = bookLogRepository.findByBookIsbn_Isbn(isbn, pageable);
        List<BookLogResponseDto> result = logs.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        PageResponseDto<BookLogResponseDto> pageDto = PageResponseDto.of(
                result,
                logs.getTotalElements(),
                logs.getTotalPages(),
                logs.getNumber()
        );
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, pageDto);
    }

    @Override
    public void logCreate(Book book, Employee employee) {
        saveAutoLog(book, employee, BookLogType.CREATE, null, null, null);
    }

    @Override
    public void logPriceChange(Book book, Long oldPrice, Employee employee) {
        saveAutoLog(book, employee, BookLogType.PRICE_CHANGE, oldPrice, null, null);
    }

    @Override
    public void logDiscountChange(Book book, Long oldRate, Policy policy, Employee employee) {
        saveAutoLog(book, employee, BookLogType.DISCOUNT_RATE, null, oldRate, policy);
    }

    @Override
    public void logHidden(Book book, Employee employee) {
        saveAutoLog(book, employee, BookLogType.HIDDEN, null, null, null);
    }

    @Override
    public void logStatusChange(Book savedBook, Employee employee) {
        saveAutoLog(savedBook, employee, BookLogType.STATUS_CHANGE, null, null, null);
    }

    private void saveAutoLog(Book book, Employee employee, BookLogType type,
                             Long prevPrice, Long prevDiscount, Policy policy) {
        BookLog log = BookLog.builder()
                .bookIsbn(book)
                .employeeId(employee)
                .bookLogType(type)
                .previousPrice(prevPrice)
                .previousDiscountRate(prevDiscount)
                .policyId(policy)
                .changedAt(LocalDateTime.now())
                .build();
        bookLogRepository.save(log);
    }

    private BookLogResponseDto toDto(BookLog log) {
        return BookLogResponseDto.builder()
                .bookLogId(log.getBookLogId())
                .bookIsbn(log.getBookIsbn().getIsbn())
                .bookTitle(log.getBookIsbn().getBookTitle())
                .employeeName(log.getEmployeeId().getName())
                .bookLogType(log.getBookLogType().name())
                .previousPrice(log.getPreviousPrice())
                .previousDiscountRate(log.getPreviousDiscountRate())
                .changedAt(log.getChangedAt())
                .build();
    }
}
