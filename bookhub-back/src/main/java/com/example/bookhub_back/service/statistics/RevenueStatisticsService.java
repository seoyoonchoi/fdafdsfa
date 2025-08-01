package com.example.bookhub_back.service.statistics;

import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.statistics.response.revenue.BranchRevenueResponseDto;
import com.example.bookhub_back.dto.statistics.response.revenue.MonthlyRevenueResponseDto;
import com.example.bookhub_back.dto.statistics.response.revenue.WeekdayRevenueResponseDto;
import com.example.bookhub_back.dto.statistics.response.revenue.WeeklyRevenueResponseDto;

import java.time.LocalDate;
import java.util.List;

public interface RevenueStatisticsService {
    ResponseDto<List<WeekdayRevenueResponseDto>> getWeekdayRevenue(int year, int quarter);

    ResponseDto<List<WeeklyRevenueResponseDto>> getWeeklyRevenue(int year, int month);

    ResponseDto<List<MonthlyRevenueResponseDto>> getMonthlyRevenue(int year);

    ResponseDto<List<BranchRevenueResponseDto>> getBranchRevenue(LocalDate startDate, LocalDate endDate);
}
