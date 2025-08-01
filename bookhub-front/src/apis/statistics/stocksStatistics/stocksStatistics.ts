import {
  axiosInstance,
  bearerAuthorization,
  responseErrorHandler,
  responseSuccessHandler,
} from "@/apis/axiosConfig";
import { ResponseDto } from "@/dtos";
import { BranchStockBarCharSearchParams } from "@/dtos/statistics/stocksStatistics/repuest/BranchStockBarCharSearchParams";
import { STOCK_STATISTICS_BRANCH_URL, STOCK_STATISTICS_CATEGORY_URL, STOCK_STATISTICS_TIME_URL, STOCK_STATISTICS_ZERO_URL } from "./stocksStatisticsUrl";
import { AxiosError } from "axios";
import { BranchStockBarChartResponseDto } from "@/dtos/statistics/stocksStatistics/response/BranchStockBarChart.response.dto";
import { CategoryStockSearchParams } from "@/dtos/statistics/stocksStatistics/repuest/CategoryStockSearchParams";
import { CategoryStockResponseDto } from "@/dtos/statistics/stocksStatistics/response/CategoryStock.response.dto";
import { ZeroStockResponseDto } from "@/dtos/statistics/stocksStatistics/response/ZeroStock.response.dto";
import { TimeStockChartSearchParams } from "@/dtos/statistics/stocksStatistics/repuest/TimeStockChartSearchParams";
import { TimeStockChartResponseDto } from "@/dtos/statistics/stocksStatistics/response/TimeStockChart.response.dto";

export const branchStockBarChartRequest = async (
  params: BranchStockBarCharSearchParams,
  accessToken: string
): Promise<ResponseDto<BranchStockBarChartResponseDto[]>> => {
  try {
    const response = await axiosInstance.get(STOCK_STATISTICS_BRANCH_URL, {
      params,
      ...bearerAuthorization(accessToken),
    });
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const categoryStockRequest = async (
  params: CategoryStockSearchParams,
  accessToken: string
): Promise<ResponseDto<CategoryStockResponseDto[]>> => {
  try {
    const response = await axiosInstance.get(STOCK_STATISTICS_CATEGORY_URL, {
      params,
      ...bearerAuthorization(accessToken),
    });
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const zeroStockRequest = async (
  accessToken: string
): Promise<ResponseDto<ZeroStockResponseDto[]>> => {
  try {
    const response = await axiosInstance.get(
      STOCK_STATISTICS_ZERO_URL,
      bearerAuthorization(accessToken)
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const timeStockChartrequest = async (
  params: TimeStockChartSearchParams,
  accessToken: string
): Promise<ResponseDto<TimeStockChartResponseDto[]>> => {
  try {
    const response = await axiosInstance.get(STOCK_STATISTICS_TIME_URL, {
      params,
      ...bearerAuthorization(accessToken),
    });
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

