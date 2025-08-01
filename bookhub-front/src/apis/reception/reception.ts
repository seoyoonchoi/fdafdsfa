import { ResponseDto } from "@/dtos";
import { ReceptionListResponseDto } from "@/dtos/reception/response/Reception.response.dto";
import axios, { AxiosError } from "axios";
import { GET_ADMIN_RECEPTION_URL, GET_CONFIRMED_RECEPTION_URL, GET_PENDING_RECEPTION_URL, PUT_RECEPTION_URL } from "./receptionUrl";
import { axiosInstance, bearerAuthorization, responseErrorHandler, responseSuccessHandler } from "../axiosConfig";
import { PageResponseDto } from "@/dtos/PageResponseDto";

export const getAllReceptionApproval = async (
  token: string,
  page: number = 0,
  size: number = 10,
  startDate?: string,
  endDate?: string
): Promise<ResponseDto<PageResponseDto<ReceptionListResponseDto>>> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("size", String(size));
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const url = `${GET_CONFIRMED_RECEPTION_URL}?${params.toString()}`;
  const response = await axiosInstance.get(url, bearerAuthorization(token));
  return responseSuccessHandler(response);
  
};

export const getAllPendingReception = async (
  token: string,
  page: number = 0,
  size: number = 10
): Promise<ResponseDto<PageResponseDto<ReceptionListResponseDto>>> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("size", String(size));
  const url = `${GET_PENDING_RECEPTION_URL}?${params.toString()}`;
  const response = await axiosInstance.get(url, bearerAuthorization(token));
  return responseSuccessHandler(response);
}


export const putReception = async (
  token: string,
  purchaseOrderApprovalId: number
): Promise<ResponseDto<ReceptionListResponseDto[]>> => {
  try {
    const response = await axiosInstance.put(
      PUT_RECEPTION_URL(purchaseOrderApprovalId),
      {},
      bearerAuthorization(token)
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const getAdminReceptionApproval = async (
  token: string,
  branchName?: string,
  bookIsbn?: string,
  page: number = 0,
  size: number = 10
): Promise<ResponseDto<PageResponseDto<ReceptionListResponseDto>>> => {
  try {
    const params = new URLSearchParams();
    if (branchName) params.append("branchName", branchName);
    if (bookIsbn) params.append("bookIsbn", bookIsbn);
    params.append("page", String(page));
    params.append("size", String(size));

    const url = `${GET_ADMIN_RECEPTION_URL}?${params.toString()}`;

    const response = await axiosInstance.get(url, bearerAuthorization(token));
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};