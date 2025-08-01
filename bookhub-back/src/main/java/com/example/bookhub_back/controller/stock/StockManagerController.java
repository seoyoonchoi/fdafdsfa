package com.example.bookhub_back.controller.stock;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.stock.request.StockUpdateRequestDto;
import com.example.bookhub_back.security.auth.EmployeePrincipal;
import com.example.bookhub_back.service.stock.StockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiMappingPattern.MANAGER_API+"/stocks")
@RequiredArgsConstructor
public class StockManagerController {

    private final StockService stockService;

    @PutMapping("/{stockId}")
    public ResponseEntity<ResponseDto<Void>> updateStock(
            @PathVariable Long stockId,
            @Valid @RequestBody StockUpdateRequestDto dto,
            @AuthenticationPrincipal EmployeePrincipal employeePrincipal){
        ResponseDto<Void> responseDto = stockService.updateStock(employeePrincipal,stockId,dto);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }
}
