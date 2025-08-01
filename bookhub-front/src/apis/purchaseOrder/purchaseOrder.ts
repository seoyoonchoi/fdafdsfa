import { ResponseDto } from "@/dtos";
import { PurchaseOrderCreateRequestDto, PurchaseOrderRequestDto } from "@/dtos/purchaseOrder/PurchaseOrder.request.dto";
import { PurchaseOrderResponseDto } from "@/dtos/purchaseOrder/PurchaseOrder.response.dto";
import { AxiosError } from "axios";
import { axiosInstance, bearerAuthorization, responseSuccessHandler, responseErrorHandler } from "../axiosConfig";
import { PurchaseOrderStatus } from "../enums/PurchaseOrderStatus";
import { POST_PURCHASE_ORDER_URL, GET_PURCHASE_ORDER_BY_CRITERIA, PUT_PURCHASE_ORDER_URL, DELETE_PURCHASE_ORDER_URL } from "./PurchaseOrderUrl";



export const createPurchaseOrder = async(dto: PurchaseOrderCreateRequestDto, accessToken: string): Promise<ResponseDto<PurchaseOrderResponseDto[]>> => {
  try{
    const response = await axiosInstance.post(POST_PURCHASE_ORDER_URL, dto, bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  }catch(error){
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
}


export const getAllPurchaseOrderByCriteria = async(employeeName: string, bookIsbn: string, purchaseOrderStatus: PurchaseOrderStatus | null, accessToken: string): Promise<ResponseDto<PurchaseOrderResponseDto[]>> => {
  try{
    const response = await axiosInstance.get(GET_PURCHASE_ORDER_BY_CRITERIA(employeeName, bookIsbn, purchaseOrderStatus), bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  }catch(error){
    return responseErrorHandler(error as AxiosError<ResponseDto>)
  }
}


export const updatePurchaseOrder = async(purchaseOrderId: number, dto: PurchaseOrderRequestDto, accessToken: string): Promise<ResponseDto<PurchaseOrderResponseDto>> => {
  try{
    const response = await axiosInstance.put(PUT_PURCHASE_ORDER_URL(purchaseOrderId), dto, bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  }catch(error){
    return responseErrorHandler(error as AxiosError<ResponseDto>)
  }
}


export const deletePurchaseOrder = async(purchaseOrderId: number, accessToken: string): Promise<ResponseDto<void>> => {
  try{
    const response = await axiosInstance.delete(DELETE_PURCHASE_ORDER_URL(purchaseOrderId), bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  }catch(error){
    return responseErrorHandler(error as AxiosError<ResponseDto>)
  }
}

