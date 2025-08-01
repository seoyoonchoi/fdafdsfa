package com.example.bookhub_back.service.stock;

import com.example.bookhub_back.common.enums.StockActionType;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.stock.response.StockLogResponseDto;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;

public interface StockLogService {
    ResponseDto<PageResponseDto<StockLogResponseDto>> getFilteredStockLogs(@Min(0) int page, @Min(1) int size, String employeeName, String keyword, StockActionType stockActionType, LocalDate start, LocalDate end);

    ResponseDto<StockLogResponseDto> getStockLogById(Long stockLogId);
}
