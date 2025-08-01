import { ResponseDto } from "@/dtos";
import {
  axiosInstance,
  bearerAuthorization,
  responseErrorHandler,
  responseSuccessHandler,
} from "../axiosConfig";
import {
  GET_ALL_EMPLOYEE_URL,
  GET_EMPLOYEE_DETAIL_URL,
  GET_PENDING_EMPLOYEE_URL,
  PUT_EMPLOYEE_APPROVE_URL,
  PUT_EMPLOYEE_CHANGE_URL,
  PUT_EMPLOYEE_STATUS_URL,
} from "./EmployeeUrl";
import { AxiosError } from "axios";
import { EmployeeSearchParams } from "@/dtos/employee/request/Employee-search-params";
import { EmployeeDetailResponseDto } from "@/dtos/employee/response/Employee-detail.response.dto";
import { EmployeeSignUpListResponseDto } from "@/dtos/employee/response/Employee-sign-up-list.response.dto";
import { EmployeeSignUpApprovalRequestDto } from "@/dtos/employee/request/Employee-sign-up-approval.request.dto";
import { EmployeeChangeRequestDto } from "@/dtos/employee/request/Employee-change.request.dto";
import { EmployeeExitUpdateRequestDto } from "@/dtos/employee/request/Employee-exit-update.request.dto";
import { EmployeeListResponseDto } from "@/dtos/employee/response/Employee-list.response.dto";
import { PageResponseDto } from "@/dtos/PageResponseDto";

export const employeeRequest = async (
  params: EmployeeSearchParams,
  accessToken: string
): Promise<ResponseDto<PageResponseDto<EmployeeListResponseDto>>> => {
  try {
    const response = await axiosInstance.get(GET_ALL_EMPLOYEE_URL, {
      params,
      ...bearerAuthorization(accessToken),
    });
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const employeeDetailRequeset = async (
  employeeId: number,
  accessToken: string
): Promise<ResponseDto<EmployeeDetailResponseDto>> => {
  try {
    const response = await axiosInstance.get(
      GET_EMPLOYEE_DETAIL_URL(employeeId),
      bearerAuthorization(accessToken)
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const employeeSignUpListRequest = async (
  params: { page: number; size: number },
  accessToken: string
): Promise<ResponseDto<PageResponseDto<EmployeeSignUpListResponseDto>>> => {
  try {
    const response = await axiosInstance.get(GET_PENDING_EMPLOYEE_URL, {
      params,
      ...bearerAuthorization(accessToken),
    });
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const employeeSignUpApprovalRequest = async (
  employeeId: number,
  dto: EmployeeSignUpApprovalRequestDto,
  accessToken: string
): Promise<ResponseDto<void>> => {
  try {
    const response = await axiosInstance.put(
      PUT_EMPLOYEE_APPROVE_URL(employeeId),
      dto,
      bearerAuthorization(accessToken)
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const employeeChangeRequestDto = async (
  employeeId: number,
  dto: EmployeeChangeRequestDto,
  accessToken: string
): Promise<ResponseDto<void>> => {
  try {
    const response = await axiosInstance.put(
      PUT_EMPLOYEE_CHANGE_URL(employeeId),
      dto,
      bearerAuthorization(accessToken)
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const employeeExitUpdateRequest = async (
  employeeId: number,
  dto: EmployeeExitUpdateRequestDto,
  accessToken: string
): Promise<ResponseDto<void>> => {
  try {
    const response = await axiosInstance.put(
      PUT_EMPLOYEE_STATUS_URL(employeeId),
      dto,
      bearerAuthorization(accessToken)
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};
