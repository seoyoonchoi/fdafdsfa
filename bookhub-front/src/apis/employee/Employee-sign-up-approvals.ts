import { ResponseDto } from "@/dtos";
import {
  axiosInstance,
  bearerAuthorization,
  responseErrorHandler,
  responseSuccessHandler,
} from "../axiosConfig";
import { GET_ALL_EMPLOYEE_SIGN_UP_APPROVALS_URL } from "./EmployeeLogUrl";
import { AxiosError } from "axios";
import { EmployeeSignUpApprovalsSearchParams } from "@/dtos/employee/request/Employee-sign-up-approvals-search-params";
import { EmployeeSignUpApprovalsResponseDto } from "@/dtos/employee/response/Employee-sign-up-approvals.response.dto";
import { PageResponseDto } from "@/dtos/PageResponseDto";

export const employeeSignUpApprovalsSearchRequest = async (
  params: EmployeeSignUpApprovalsSearchParams,
  accessToken: string
): Promise<
  ResponseDto<PageResponseDto<EmployeeSignUpApprovalsResponseDto>>
> => {
  try {
    const response = await axiosInstance.get(
      GET_ALL_EMPLOYEE_SIGN_UP_APPROVALS_URL,
      { params, ...bearerAuthorization(accessToken) }
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};
