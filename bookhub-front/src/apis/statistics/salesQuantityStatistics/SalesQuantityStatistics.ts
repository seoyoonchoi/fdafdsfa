import { axiosInstance, bearerAuthorization, responseErrorHandler, responseSuccessHandler } from "@/apis/axiosConfig";
import { ResponseDto } from "@/dtos";
import { Axios, AxiosError } from "axios";
import { GET_BEST_SELLERS_BY_CATEGORY, GET_DAILY_SALES_QUANTITY, GET_MONTHLY_BEST_SELLERS, GET_MONTHLY_SALES_QUANTITY, GET_SALES_QUANTITY_BY_BRANCH, GET_SALES_QUANTITY_BY_CATEGORY, GET_SALES_QUANTITY_BY_DISCOUNT_POLICY, GET_TOP_100_BEST_SELLERS, GET_WEEKLY_BEST_SELLERS, GET_WEEKLY_SALES_QUANTITY, GET_YEARLY_BEST_SELLERS } from "./SalesQuantityStatisticsUrl";
import { access } from "fs";
import { BestSellerResponseDto } from "@/dtos/statistics/salesQuantityStatistics/response/BestSeller.response.dto";
import { CategorySalesQuantityResponseDto } from "@/dtos/statistics/salesQuantityStatistics/response/CategorySalesQuantity.response.dto";
import { SalesQuantityStatisticsResponseDto } from "@/dtos/statistics/salesQuantityStatistics/response/SalesQuantity.response.dto";

export const getTop100BestSellers = async(
  accessToken: string
): Promise<ResponseDto<BestSellerResponseDto[]>> => {
  try {
    const response = await axiosInstance.get(
      GET_TOP_100_BEST_SELLERS, bearerAuthorization(accessToken)
    );
    return responseSuccessHandler(response);
  } catch(error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>)
  }
};

export const getWeeklyBestSellers = async(
  accessToken: string
): Promise<ResponseDto<BestSellerResponseDto[]>> => {
  try{
    const response = await axiosInstance.get(GET_WEEKLY_BEST_SELLERS, bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  } catch(error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>)
  }
};

export const getMonthlyBestSellers = async(
  accessToken: string
): Promise<ResponseDto<BestSellerResponseDto[]>> => {
  try {
    const response = await axiosInstance.get(GET_MONTHLY_BEST_SELLERS, bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  } catch(error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>)
  }
};

export const getYearlyBestSellers = async(
  accessToken: string
): Promise<ResponseDto<BestSellerResponseDto[]>> => {
  try {
    const response = await axiosInstance.get(GET_YEARLY_BEST_SELLERS, bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  } catch(error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const getBestSellersByCategory = async(
  categoryId: number,
  accessToken: string
): Promise<ResponseDto<BestSellerResponseDto[]>> => {
  try {
    const response = await axiosInstance.get(GET_BEST_SELLERS_BY_CATEGORY(categoryId), bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  } catch(error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const getDailySalesQuantity = async(
  month: number,
  accessToken: string
): Promise<ResponseDto<SalesQuantityStatisticsResponseDto[]>> => {
  try {
    const response = await axiosInstance.get(GET_DAILY_SALES_QUANTITY, {
      ...bearerAuthorization(accessToken),
      params: { month }
    });
    return responseSuccessHandler(response);
  } catch(error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>)
  }
}

export const getWeeklySalesQuantity = async(
  year: number,
  month: number,
  accessToken: string
): Promise<ResponseDto<SalesQuantityStatisticsResponseDto[]>> => {
  try {
    const response = await axiosInstance.get(GET_WEEKLY_SALES_QUANTITY, {
      ...bearerAuthorization(accessToken),
      params: { year, month }
    });
    return responseSuccessHandler(response);
  } catch(error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const getMonthlySalesQuantity = async(
  year: number,
  accessToken: string
): Promise<ResponseDto<SalesQuantityStatisticsResponseDto[]>> => {
  try {
    const response = await axiosInstance.get(GET_MONTHLY_SALES_QUANTITY(year), bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  } catch(error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const getSalesQuantityByCategory = async(
  accessToken: string
): Promise<ResponseDto<CategorySalesQuantityResponseDto[]>> => {
  try {
    const response = await axiosInstance.get(GET_SALES_QUANTITY_BY_CATEGORY, bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  } catch(error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const getSalesQuantityByBranch = async(
  year: number,
  month: number,
  accessToken: string
): Promise<ResponseDto<SalesQuantityStatisticsResponseDto[]>> => {
  try {
    const response = await axiosInstance.get(GET_SALES_QUANTITY_BY_BRANCH(year, month), bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  } catch(error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const getSalesQuantityByDiscountPolicy = async(
  year: number,
  quarter: number,
  accessToken: string
): Promise<ResponseDto<SalesQuantityStatisticsResponseDto[]>> => {
  try {
    const response = await axiosInstance.get(GET_SALES_QUANTITY_BY_DISCOUNT_POLICY(year, quarter), bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  } catch(error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};