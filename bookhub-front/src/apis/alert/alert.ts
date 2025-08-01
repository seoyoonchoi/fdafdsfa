import { ResponseDto } from "@/dtos";
import { GET_ALERT_URL, GET_UNREAD_ALERT_COUNT_URL, GET_UNREAD_ALERT_URL, PUT_ALERT_URL } from "./alertUrl";
import { axiosInstance, bearerAuthorization, responseErrorHandler, responseSuccessHandler } from "../axiosConfig";
import { AxiosError } from "axios";
import { AlertResponseDto } from "@/dtos/alert/response/Alert.response.dto";
import { PageResponseDto } from "@/dtos/PageResponseDto";

export const getUnreadAlerts = async (
  employeeId: number,
  accessToken: string,
  page: number = 0,
  size: number = 10
): Promise<ResponseDto<PageResponseDto<AlertResponseDto>>> => {
  try {
    const url = GET_UNREAD_ALERT_URL.replace("{employeeId}", String(employeeId)) + `?page=${page}${size}`;
    const response = await axiosInstance.get(url, bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  } catch(error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const getAllAlerts = async (
  employeeId: number,
  accessToken: string
): Promise<ResponseDto<AlertResponseDto[]>> => {
  try {
    const url = GET_ALERT_URL.replace("{employeeId}", String(employeeId));
    const response = await axiosInstance.get(url, bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const markAlertsAsRead = async (
  alertIds: number[],
  accessToken: string
): Promise<ResponseDto<null>> => {
  try {
    const response = await axiosInstance.put(
      PUT_ALERT_URL,
      { alertIds },
      bearerAuthorization(accessToken)
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const getUnreadAlertCount = async (
  employeeId: number,
  accessToken: string
): Promise<ResponseDto<number>> => {
  try {
    const url = GET_UNREAD_ALERT_COUNT_URL.replace("{employeeId}", String(employeeId));
    const response = await axiosInstance.get(url, bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const getAlertTargetUrl = (alert: AlertResponseDto): string | null => {
  switch (alert.alertType) {
    case "PURCHASE_REQUESTED":
      return `/purchase-order/approve`;
    case "PURCHASE_APPROVED":
      return `/purchase-order/else`;
    case "BOOK_RECEIVED_SUCCESS":
      return `/reception/logs`;
    case "NOTICE":
      return `/policies`;
    case "SIGNUP_APPROVAL":
      return `/employees/approval`;
    case "STOCK_LOW":
    case "STOCK_OUT":
      return `/stocks`;
    default:
      return null;
  }
}