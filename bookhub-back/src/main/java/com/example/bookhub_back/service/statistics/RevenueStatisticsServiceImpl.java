package com.example.bookhub_back.service.statistics;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessage;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.statistics.response.revenue.BranchRevenueResponseDto;
import com.example.bookhub_back.dto.statistics.response.revenue.MonthlyRevenueResponseDto;
import com.example.bookhub_back.dto.statistics.response.revenue.WeekdayRevenueResponseDto;
import com.example.bookhub_back.dto.statistics.response.revenue.WeeklyRevenueResponseDto;
import com.example.bookhub_back.mapper.RevenueStatisticsMapper;
import com.example.bookhub_back.repository.statistics.RevenueStatisticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RevenueStatisticsServiceImpl implements RevenueStatisticsService {

    private final RevenueStatisticsRepository revenueStatisticsRepository;
    private final RevenueStatisticsMapper revenueStatisticsMapper;

    @Override
    public ResponseDto<List<WeekdayRevenueResponseDto>> getWeekdayRevenue(int year, int quarter) {
        int startMonth = (quarter - 1) * 3+1;
        int endMonth = (quarter - 1) * 3+3;

        List<WeekdayRevenueResponseDto> raw = revenueStatisticsMapper.findRevenueGroupedByWeekday(year, startMonth, endMonth);
        List<String> weekdays = List.of("월","화","수","목","금","토","일");
        Map<String, Long> salesMap = new LinkedHashMap<>();
        weekdays.forEach(weekday -> salesMap.put(weekday,0L));

        for(WeekdayRevenueResponseDto w : raw) {
            salesMap.put(w.getWeekday(), w.getTotal());
        }

        List<WeekdayRevenueResponseDto> responseDtos = weekdays.stream()
                .map(day -> new WeekdayRevenueResponseDto(day, salesMap.get(day)))
                .collect(Collectors.toList());

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDtos);
    }

    @Override
    public ResponseDto<List<WeeklyRevenueResponseDto>> getWeeklyRevenue(int year, int month) {
        List<WeeklyRevenueResponseDto> responsedto = revenueStatisticsRepository.findWeeklySales(year, month);
        return ResponseDto.success(ResponseCode.SUCCESS,ResponseMessage.SUCCESS,responsedto);
    }

    @Override
    public ResponseDto<List<MonthlyRevenueResponseDto>> getMonthlyRevenue(int year) {
        List<MonthlyRevenueResponseDto> responseDto = revenueStatisticsMapper.findMonthlySales(year);
        return ResponseDto.success(ResponseCode.SUCCESS,ResponseMessage.SUCCESS,responseDto);
    }

    @Override
    public ResponseDto<List<BranchRevenueResponseDto>> getBranchRevenue(LocalDate startDate, LocalDate endDate) {
        List<BranchRevenueResponseDto> dtos = revenueStatisticsRepository.findByBranchByDate(startDate,endDate);
        return ResponseDto.success(ResponseCode.SUCCESS,ResponseMessage.SUCCESS,dtos);
    }
}
