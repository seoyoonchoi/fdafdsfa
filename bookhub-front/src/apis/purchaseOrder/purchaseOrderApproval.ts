import { AxiosError } from "axios";
import {
  axiosInstance,
  bearerAuthorization,
  responseErrorHandler,
  responseSuccessHandler,
} from "../axiosConfig";
import { GET_ALL_PURCHASE_ORDER_REQUESTED_URL, PURCHASE_APPROVAL_MODULE_URL_ADMIN, PUT_PURCHASE_ORDER_STATUS_URL } from "./purchaseOrderApprovalUrl";
import { ResponseDto } from "@/dtos";
import { PurchaseOrderApprovalSearchParams } from "@/dtos/purchaseOrder/PurchaseOrderApprovalSearchParams";
import { PurchaseOrderApprovalResponseDto } from "@/dtos/purchaseOrderApproval/purchaseOrderApproval.response.dto";
import { PageResponseDto } from "@/dtos/PageResponseDto";
import { PurchaseOrderResponseDto } from "@/dtos/purchaseOrder/PurchaseOrder.response.dto";
import { PurchaseOrderApproveRequestDto } from "@/dtos/purchaseOrderApproval/purchaseOrderApproval.request.dto";

export const getAllPurchaseOrderApproval = async (
  params: PurchaseOrderApprovalSearchParams,
  accessToken: string
): Promise<ResponseDto<PageResponseDto<PurchaseOrderApprovalResponseDto>>> => {
  try {
    const response = await axiosInstance.get(PURCHASE_APPROVAL_MODULE_URL_ADMIN, {
      params,
      ...bearerAuthorization(accessToken),
    });
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

// 발주 요청서 업데이트 (요청중인 발주 요청서만 전체 조회)
export const getAllPurchaseOrderRequested = async(accessToken: string): Promise<ResponseDto<PurchaseOrderResponseDto[]>> => {
  try{
    const response = await axiosInstance.get(GET_ALL_PURCHASE_ORDER_REQUESTED_URL, bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  }catch(error){
    return responseErrorHandler(error as AxiosError<ResponseDto>)
  }
}

// 발주 요청서 승인 / 승인 거절
export const updatePurchaseOrderStatus = async(purchaseOrderId: number, dto: PurchaseOrderApproveRequestDto, accessToken: string): Promise<ResponseDto<PurchaseOrderResponseDto>> => {
  try{
    const response = await axiosInstance.put(PUT_PURCHASE_ORDER_STATUS_URL(purchaseOrderId), dto, bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  }catch(error){
    return responseErrorHandler(error as AxiosError<ResponseDto>)
  }
}