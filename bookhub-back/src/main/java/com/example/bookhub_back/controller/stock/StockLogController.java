package com.example.bookhub_back.controller.stock;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.common.enums.StockActionType;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.stock.response.StockLogResponseDto;
import com.example.bookhub_back.service.stock.StockLogService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping(
        ApiMappingPattern.ADMIN_API+"/stock-log")
@RequiredArgsConstructor
public class StockLogController {
    private final StockLogService stockLogService;

    @GetMapping
    public ResponseEntity<ResponseDto<PageResponseDto<StockLogResponseDto>>> getStockLogs(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size,
            @RequestParam(required = false) String employeeName,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false)StockActionType stockActionType,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate start,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate end){
        ResponseDto<PageResponseDto<StockLogResponseDto>> response = stockLogService.getFilteredStockLogs(page,size, employeeName, keyword,stockActionType,start,end);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{stockLogId}")
    public ResponseEntity<ResponseDto<StockLogResponseDto>> getStockLogById(
            @PathVariable Long stockLogId){
        ResponseDto<StockLogResponseDto> stockLog = stockLogService.getStockLogById(stockLogId);
        return ResponseEntity.status(HttpStatus.OK).body(stockLog);
    }
}
