package com.example.bookhub_back.service.stock;

import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.stock.request.StockUpdateRequestDto;
import com.example.bookhub_back.dto.stock.response.StockResponseDto;
import com.example.bookhub_back.security.auth.EmployeePrincipal;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

public interface StockService {
    ResponseDto<Void> updateStock(EmployeePrincipal employeePrincipal, Long stockId, @Valid StockUpdateRequestDto dto);

    ResponseDto<PageResponseDto<StockResponseDto>> getFilteredStocks(@Min(0) int page, @Min(1) int size, Long branchId, String bookTitle);

    ResponseDto<StockResponseDto> getStockById(Long stockId);
}
