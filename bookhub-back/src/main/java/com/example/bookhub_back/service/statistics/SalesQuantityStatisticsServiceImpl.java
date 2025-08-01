package com.example.bookhub_back.service.statistics;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessage;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.statistics.response.salesQuantity.BestSellerDto;
import com.example.bookhub_back.dto.statistics.response.salesQuantity.CategorySalesQuantityDto;
import com.example.bookhub_back.dto.statistics.response.salesQuantity.SalesQuantityStatisticsDto;
import com.example.bookhub_back.mapper.SalesQuantityStatisticsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesQuantityStatisticsServiceImpl implements SalesQuantityStatisticsService {
    private final SalesQuantityStatisticsMapper statisticsMapper;

    @Override
    public ResponseDto<List<BestSellerDto>> getTop100BestSellers() {
        List<BestSellerDto> responseDto = statisticsMapper.findTop100BestSellers();
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto);
    }

    @Override
    public ResponseDto<List<BestSellerDto>> getWeeklyBestSellers() {
        List<BestSellerDto> responseDto = statisticsMapper.findWeeklyBestSellers();
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto);
    }

    @Override
    public ResponseDto<List<BestSellerDto>> getMonthlyBestSellers() {
        List<BestSellerDto> responseDto = statisticsMapper.findMonthlyBestSellers();
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto);
    }

    @Override
    public ResponseDto<List<BestSellerDto>> getYearlyBestSellers() {
        List<BestSellerDto> responseDto = statisticsMapper.findYearlyBestSellers();
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto);
    }

    @Override
    public ResponseDto<List<BestSellerDto>> getBestSellersByCategory(Long categoryId) {
        List<BestSellerDto> responseDto = statisticsMapper.findBestSellersByCategory(categoryId);
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto) ;
    }

    @Override
    public ResponseDto<List<CategorySalesQuantityDto>> getSalesQuantityByCategory() {
        List<CategorySalesQuantityDto> responseDto = statisticsMapper.findSalesQuantityByCategory();
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto);
    }

    @Override
    public ResponseDto<List<SalesQuantityStatisticsDto>> getSalesQuantityByPolicy(int year, int quarter) {
        List<SalesQuantityStatisticsDto> responseDto = statisticsMapper.findSalesQuantityByPolicy(year, quarter);
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto);
    }

    @Override
    public ResponseDto<List<SalesQuantityStatisticsDto>> getSalesQuantityByBranch(int year, int month) {
        List<SalesQuantityStatisticsDto> responseDto = statisticsMapper.findSalesQuantityByBranch(year, month);
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto) ;
    }

    @Override
    public ResponseDto<List<SalesQuantityStatisticsDto>> getDailySalesQuantity(int month) {
        List<SalesQuantityStatisticsDto> responseDto = statisticsMapper.findDailySalesQuantity(month);
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto);
    }

    @Override
    public ResponseDto<List<SalesQuantityStatisticsDto>> getWeeklySalesQuantity(int year, int month) {
        List<SalesQuantityStatisticsDto> responseDto = statisticsMapper.findWeeklySalesQuantity(year, month);
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto);
    }

    @Override
    public ResponseDto<List<SalesQuantityStatisticsDto>> getMonthlySalesQuantity(int year) {
        List<SalesQuantityStatisticsDto> responseDto = statisticsMapper.findMonthlySalesQuantity(year);
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto);
    }
}
