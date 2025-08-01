package com.example.bookhub_back.controller.statistics;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.statistics.response.salesQuantity.BestSellerDto;
import com.example.bookhub_back.dto.statistics.response.salesQuantity.CategorySalesQuantityDto;
import com.example.bookhub_back.dto.statistics.response.salesQuantity.SalesQuantityStatisticsDto;
import com.example.bookhub_back.service.statistics.SalesQuantityStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiMappingPattern.BASIC_API)
@RequiredArgsConstructor
public class SalesQuantityStatisticsController {
    private final SalesQuantityStatisticsService salesQuantityStatisticsService;
    private final String BEST_SELLERS_API = ApiMappingPattern.MANAGER_API + ("/statistics/sales-quantity/bestseller");
    private final String SALES_QUANTITY_API = ApiMappingPattern.ADMIN_API + ("/statistics/sales-quantity");

    @GetMapping(BEST_SELLERS_API)
    public ResponseEntity<ResponseDto<List<BestSellerDto>>> getTop100BestSellers() {
        ResponseDto<List<BestSellerDto>> responseDto = salesQuantityStatisticsService.getTop100BestSellers();
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping(BEST_SELLERS_API + ("/weekly"))
    public ResponseEntity<ResponseDto<List<BestSellerDto>>> getWeeklyBestSellers() {
        ResponseDto<List<BestSellerDto>> response= salesQuantityStatisticsService.getWeeklyBestSellers();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping(BEST_SELLERS_API + ("/monthly"))
    public ResponseEntity<ResponseDto<List<BestSellerDto>>> getMonthlyBestSellers() {
        ResponseDto<List<BestSellerDto>> response = salesQuantityStatisticsService.getMonthlyBestSellers();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping(BEST_SELLERS_API + ("/yearly"))
    public ResponseEntity<ResponseDto<List<BestSellerDto>>> getYearlyBestSellers() {
        ResponseDto<List<BestSellerDto>> response = salesQuantityStatisticsService.getYearlyBestSellers();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping(BEST_SELLERS_API + ("/category/{categoryId}"))
    public ResponseEntity<ResponseDto<List<BestSellerDto>>> getBestSellersByCategory(
            @PathVariable Long categoryId) {
        ResponseDto<List<BestSellerDto>> response = salesQuantityStatisticsService.getBestSellersByCategory(categoryId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping(SALES_QUANTITY_API + ("/daily"))
    public ResponseEntity<ResponseDto<List<SalesQuantityStatisticsDto>>> getDailySalesQuantity(
            @RequestParam("month") int month
    ) {
        ResponseDto<List<SalesQuantityStatisticsDto>> response = salesQuantityStatisticsService.getDailySalesQuantity(month);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping(SALES_QUANTITY_API + ("/weekly"))
    public ResponseEntity<ResponseDto<List<SalesQuantityStatisticsDto>>> getWeeklySalesQuantity(
            @RequestParam("year") int year,
            @RequestParam("month") int month
    ) {
        ResponseDto<List<SalesQuantityStatisticsDto>> response = salesQuantityStatisticsService.getWeeklySalesQuantity(year, month);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping(SALES_QUANTITY_API + ("/monthly"))
    public ResponseEntity<ResponseDto<List<SalesQuantityStatisticsDto>>> getMonthlySalesQuantity(
            @RequestParam int year
    ) {
        ResponseDto<List<SalesQuantityStatisticsDto>> response = salesQuantityStatisticsService.getMonthlySalesQuantity(year);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping(SALES_QUANTITY_API + ("/category"))
    public ResponseEntity<ResponseDto<List<CategorySalesQuantityDto>>> getCategorySalesQuantity() {
        ResponseDto<List<CategorySalesQuantityDto>> response = salesQuantityStatisticsService.getSalesQuantityByCategory();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping(SALES_QUANTITY_API + ("/discount-policy"))
    public ResponseEntity<ResponseDto<List<SalesQuantityStatisticsDto>>> getDiscountPolicySalesQuantity(
            @RequestParam int year,
            @RequestParam int quarter
    ) {
        ResponseDto<List<SalesQuantityStatisticsDto>> response = salesQuantityStatisticsService.getSalesQuantityByPolicy(year, quarter);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping(SALES_QUANTITY_API + ("/branch"))
    public ResponseEntity<ResponseDto<List<SalesQuantityStatisticsDto>>> getSalesQuantityByBranch(
            @RequestParam int year,
            @RequestParam int month
    ) {
        ResponseDto<List<SalesQuantityStatisticsDto>> response = salesQuantityStatisticsService.getSalesQuantityByBranch(year, month);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
