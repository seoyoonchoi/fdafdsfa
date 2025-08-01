import { axiosInstance, bearerAuthorization, responseSuccessHandler, responseErrorHandler } from "@/apis/axiosConfig";
import { ResponseDto } from "@/dtos";
import { WeekdayRevenueResponseDto, WeeklyRevenueResponseDto, MonthlyRevenueResponseDto, BranchRevenueResponseDto } from "@/dtos/statistics/revenue/Revenue.response.dto";
import { AxiosError } from "axios";
import { REVENUE_STATISTICS_WEEKDAY_URL, REVENUE_STATISTICS_WEEKLY_URL, REVENUE_STATISTICS_MONTHLY_URL, REVENUE_STATISTICS_BRANCH_URL } from "./revenueStatisticsUrl";

/**
 * 요일별 매출 조회
 */
export const fetchWeekday = async (
  token: string,
  year: number,
  quarter: number
): Promise<ResponseDto<WeekdayRevenueResponseDto[]>> => {
  try {
    const response = await axiosInstance.get<
      ResponseDto<WeekdayRevenueResponseDto[]>
    >(
      REVENUE_STATISTICS_WEEKDAY_URL,
      {
        ...bearerAuthorization(token),
        params: { year, quarter }
      }
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

/**
 * 주차별 매출 조회
 */
export const fetchWeekly = async (
  token: string,
  year: number,
  month: number
): Promise<ResponseDto<WeeklyRevenueResponseDto[]>> => {
  try {
    const response = await axiosInstance.get<
      ResponseDto<WeeklyRevenueResponseDto[]>
    >(
      REVENUE_STATISTICS_WEEKLY_URL,
      {
        ...bearerAuthorization(token),
        params: { year, month }
      }
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

/**
 * 월별 매출 조회 (지난 12개월)
 */
export const fetchMonthly = async (
  year: number,
  token: string
): Promise<ResponseDto<MonthlyRevenueResponseDto[]>> => {
  try {
    const response = await axiosInstance.get<
      ResponseDto<MonthlyRevenueResponseDto[]>
    >(
      REVENUE_STATISTICS_MONTHLY_URL,
      {
        ...bearerAuthorization(token),
        params: { year }
      }
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

/**
 * 지점·카테고리별 매출 조회
 */
export const fetchBranchRevenue = async (
  token: string,
  startDate: string,
  endDate: string
): Promise<ResponseDto<BranchRevenueResponseDto[]>> => {
  try {
    const response = await axiosInstance.get<
      ResponseDto<BranchRevenueResponseDto[]>
    >(
      REVENUE_STATISTICS_BRANCH_URL,
      {
        ...bearerAuthorization(token),
        params: { startDate, endDate }
      }
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};
