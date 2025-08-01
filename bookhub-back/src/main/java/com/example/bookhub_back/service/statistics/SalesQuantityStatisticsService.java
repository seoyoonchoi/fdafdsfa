package com.example.bookhub_back.service.statistics;

import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.statistics.response.salesQuantity.BestSellerDto;
import com.example.bookhub_back.dto.statistics.response.salesQuantity.CategorySalesQuantityDto;
import com.example.bookhub_back.dto.statistics.response.salesQuantity.SalesQuantityStatisticsDto;

import java.util.List;

public interface SalesQuantityStatisticsService {
    ResponseDto<List<BestSellerDto>> getTop100BestSellers();
    ResponseDto<List<BestSellerDto>> getWeeklyBestSellers();
    ResponseDto<List<BestSellerDto>> getMonthlyBestSellers();
    ResponseDto<List<BestSellerDto>> getYearlyBestSellers();
    ResponseDto<List<BestSellerDto>> getBestSellersByCategory(Long categoryId);
    ResponseDto<List<CategorySalesQuantityDto>> getSalesQuantityByCategory();
    ResponseDto<List<SalesQuantityStatisticsDto>> getSalesQuantityByPolicy(int year, int quarter);
    ResponseDto<List<SalesQuantityStatisticsDto>> getSalesQuantityByBranch(int year, int month);
    ResponseDto<List<SalesQuantityStatisticsDto>> getDailySalesQuantity(int month);
    ResponseDto<List<SalesQuantityStatisticsDto>> getWeeklySalesQuantity(int year, int month);
    ResponseDto<List<SalesQuantityStatisticsDto>> getMonthlySalesQuantity(int year);
}
