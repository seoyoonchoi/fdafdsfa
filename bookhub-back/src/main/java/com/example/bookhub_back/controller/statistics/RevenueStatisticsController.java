package com.example.bookhub_back.controller.statistics;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.statistics.response.revenue.BranchRevenueResponseDto;
import com.example.bookhub_back.dto.statistics.response.revenue.MonthlyRevenueResponseDto;
import com.example.bookhub_back.dto.statistics.response.revenue.WeekdayRevenueResponseDto;
import com.example.bookhub_back.dto.statistics.response.revenue.WeeklyRevenueResponseDto;
import com.example.bookhub_back.service.statistics.RevenueStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping(ApiMappingPattern.ADMIN_API+"/statistics/revenue")
@RequiredArgsConstructor
public class RevenueStatisticsController {
    private final RevenueStatisticsService revenueService;

    @GetMapping("/weekday")
    public ResponseEntity<ResponseDto<List<WeekdayRevenueResponseDto>>> getWeekdayRevenue(
            @RequestParam int year,
            @RequestParam int quarter
    ){
        ResponseDto<List<WeekdayRevenueResponseDto>> revenue = revenueService.getWeekdayRevenue(year,quarter);
        return ResponseEntity.status(HttpStatus.OK).body(revenue);
    }


    @GetMapping("/weekly")
    public ResponseEntity<ResponseDto<List<WeeklyRevenueResponseDto>>> getWeeklyRevenue(
            @RequestParam("year") int year,
            @RequestParam("month") int month
    ){
        ResponseDto<List<WeeklyRevenueResponseDto>> revenue = revenueService.getWeeklyRevenue(year, month);
        return ResponseEntity.status(HttpStatus.OK).body(revenue);
    }

    @GetMapping("/monthly")
    public ResponseEntity<ResponseDto<List<MonthlyRevenueResponseDto>>> getMonthlyRevenue(
            @RequestParam int year
    ){
        ResponseDto<List<MonthlyRevenueResponseDto>> revenue = revenueService.getMonthlyRevenue(year);
        return ResponseEntity.status(HttpStatus.OK).body(revenue);
    }

    @GetMapping("/branch")
    public ResponseEntity<ResponseDto<List<BranchRevenueResponseDto>>> getBranchRevenue(
            @RequestParam("startDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam("endDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ){
        ResponseDto<List<BranchRevenueResponseDto>> revenue = revenueService.getBranchRevenue(startDate,endDate);
        return ResponseEntity.status(HttpStatus.OK).body(revenue);
    }
}
