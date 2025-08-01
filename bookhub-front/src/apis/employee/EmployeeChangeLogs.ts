import { ResponseDto } from "@/dtos";
import { EmployeeChangeLogsSearchParams } from "@/dtos/employee/request/Employee-change-logs-search-params";
import {
  axiosInstance,
  bearerAuthorization,
  responseErrorHandler,
  responseSuccessHandler,
} from "../axiosConfig";
import { GET_ALL_EMPLOYEE_CHANGE_LOGS_URL } from "./EmployeeLogUrl";
import { AxiosError } from "axios";
import { EmployeeChangeLogsResponseDto } from "@/dtos/employee/response/Employee-change-logs.response.dto";
import { PageResponseDto } from "@/dtos/PageResponseDto";

export const employeeChangeLogsSearchRequest = async (
  params: EmployeeChangeLogsSearchParams,
  accessToken: string
): Promise<ResponseDto<PageResponseDto<EmployeeChangeLogsResponseDto>>> => {
  try {
    const response = await axiosInstance.get(GET_ALL_EMPLOYEE_CHANGE_LOGS_URL, {
      params,
      ...bearerAuthorization(accessToken),
    });
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};
