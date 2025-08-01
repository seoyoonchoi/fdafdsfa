package com.example.bookhub_back.service.stock;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessage;
import com.example.bookhub_back.common.enums.StockActionType;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.policy.response.PolicyListResponseDto;
import com.example.bookhub_back.dto.stock.response.StockLogResponseDto;
import com.example.bookhub_back.entity.StockLog;
import com.example.bookhub_back.repository.BookRepository;
import com.example.bookhub_back.repository.BranchRepository;
import com.example.bookhub_back.repository.EmployeeRepository;
import com.example.bookhub_back.repository.stock.StockLogRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockLogServiceImpl implements StockLogService{

    private final StockLogRepository stockLogRepository;

    @Override
    public ResponseDto<PageResponseDto<StockLogResponseDto>> getFilteredStockLogs(int page, int size, String employeeName, String keyword, StockActionType stockActionType, LocalDate start, LocalDate end) {
        Pageable pageable = PageRequest.of(page, size);
        Page<StockLog> result = stockLogRepository.findFilteredStockLog(employeeName,stockActionType,keyword != null && keyword.isBlank() ? null : keyword,start,end,pageable);

        List<StockLogResponseDto> content = result.getContent().stream()
                .map(stockLog -> StockLogResponseDto.builder()
                        .stockLogId(stockLog.getLogId())
                        .type(String.valueOf(stockLog.getStockActionType()))
                        .employeeName(stockLog.getEmployee().getName())
                        .bookTitle(stockLog.getBookIsbn().getBookTitle())
                        .branchName(stockLog.getBranchId().getBranchName())
                        .amount(stockLog.getAmount())
                        .actionDate(stockLog.getActionDate())
                        .build()
                ).collect(Collectors.toList());

        PageResponseDto<StockLogResponseDto> pageDto = PageResponseDto.of(content,
                result.getTotalElements(),
                result.getTotalPages(),
                result.getNumber());

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, pageDto);
    }

    @Override
    public ResponseDto<StockLogResponseDto> getStockLogById(Long stockLogId) {
        StockLog stockLog = stockLogRepository.findById(stockLogId)
                .orElseThrow(() -> new EntityNotFoundException(ResponseCode.NO_EXIST_ID));

        StockLogResponseDto responseDto = null;

        responseDto = StockLogResponseDto.builder()
                .stockLogId(stockLog.getLogId())
                .type(String.valueOf(stockLog.getStockActionType()))
                .employeeName(stockLog.getEmployee().getName())
                .bookTitle(stockLog.getBookIsbn().getBookTitle())
                .branchName(stockLog.getBranchId().getBranchName())
                .amount(stockLog.getAmount())
                .bookAmount(stockLog.getBookAmount())
                .actionDate(stockLog.getActionDate())
                .description(stockLog.getDescription())
                .build();

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto);
    }
}
