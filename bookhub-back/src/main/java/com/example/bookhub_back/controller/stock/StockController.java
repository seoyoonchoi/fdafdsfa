package com.example.bookhub_back.controller.stock;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.stock.response.StockResponseDto;
import com.example.bookhub_back.service.stock.StockService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiMappingPattern.COMMON_API+"/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping
    public ResponseEntity<ResponseDto<PageResponseDto<StockResponseDto>>> getStocks(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size,
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) String bookTitle){
        ResponseDto<PageResponseDto<StockResponseDto>> response = stockService.getFilteredStocks(page,size,branchId,bookTitle);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{stockId}")
    public ResponseEntity<ResponseDto<StockResponseDto>> getStockById(

            @PathVariable Long stockId){
        ResponseDto<StockResponseDto> responseDto = stockService.getStockById(stockId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }
}
