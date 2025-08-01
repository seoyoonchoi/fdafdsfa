package com.example.bookhub_back.controller.statistics;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.statistics.projection.ZeroStockProjection;
import com.example.bookhub_back.dto.statistics.response.stocks.BranchStockBarChartDto;
import com.example.bookhub_back.dto.statistics.response.stocks.CategoryStockResponseDto;
import com.example.bookhub_back.dto.statistics.response.stocks.TimeStockChartResponseDto;
import com.example.bookhub_back.service.statistics.StocksStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(ApiMappingPattern.ADMIN_API + "/statistics/stocks")
@RequiredArgsConstructor
public class StocksStatisticsController {
    private final StocksStatisticsService stocksStatisticsService;

    @GetMapping("/branch")
    public ResponseEntity<ResponseDto<List<BranchStockBarChartDto>>> getBranchStockBarChart(
        @RequestParam int year,
        @RequestParam int month
    ) {
        ResponseDto<List<BranchStockBarChartDto>> stockStatistics = stocksStatisticsService.getBranchStockBarChart(year, month);
        return ResponseEntity.status(HttpStatus.OK).body(stockStatistics);
    }

    @GetMapping("/time")
    public ResponseEntity<ResponseDto<List<TimeStockChartResponseDto>>> getTimeStockStatistics(
        @RequestParam Long year
    ) {
        ResponseDto<List<TimeStockChartResponseDto>> revenue = stocksStatisticsService.getTimeStockStatistics(year);
        return ResponseEntity.status(HttpStatus.OK).body(revenue);
    }

    @GetMapping("/zero")
    public ResponseEntity<ResponseDto<List<ZeroStockProjection>>> getZeroStockBooks() {
        ResponseDto<List<ZeroStockProjection>> revenue = stocksStatisticsService.getZeroStockBooks();
        return ResponseEntity.status(HttpStatus.OK).body(revenue);
    }

    @GetMapping("/category")
    public ResponseEntity<ResponseDto<List<CategoryStockResponseDto>>> getCategoryStocks(
        @RequestParam String branchName
    ) {
        ResponseDto<List<CategoryStockResponseDto>> revenue = stocksStatisticsService.getCategoryStocks(branchName);
        return ResponseEntity.status(HttpStatus.OK).body(revenue);
    }
}
