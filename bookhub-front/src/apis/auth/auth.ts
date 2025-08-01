import { SignUpRequestDto } from "@/dtos/auth/request/Sign-up.request.dto";
import {
  axiosInstance,
  responseErrorHandler,
  responseSuccessHandler,
} from "../axiosConfig";
import {
  CHECK_DUPLICATE_EMAIL,
  CHECK_DUPLICATE_LOGIN_ID,
  CHECK_DUPLICATE_PHONE_NUMBER,
  GET_LOGIN_ID_URL,
  LOGIN_ID_FIND_EMAIL_RUL,
  LOGOUT_URL,
  PASSWORD_CHANGE_EMAIL_URL,
  PASSWORD_CHANGE_URL,
  PUT_EMPLOYEE_URL,
  SIGN_IN_URL,
  SIGN_UP_RESULT_URL,
  SIGN_UP_URL,
} from "./authUrl";
import { AxiosError } from "axios";
import { ResponseDto } from "@/dtos";
import { SignInRequestDto } from "@/dtos/auth/request/Sign-in.request.dto";
import { LoginIdFindSendEmailRequestDto } from "@/dtos/auth/request/Login-id-find-send-email.request.dto";
import { PasswordChangeSendEmailRequestDto } from "@/dtos/auth/request/Password-change-send-email.request.dto";
import { PasswordChangeRequestDto } from "@/dtos/auth/request/Password-change.request.dto";
import { EmployeeUpdateRequestDto } from "@/dtos/auth/request/Employee-update.request.dto";
import { SignInResponseDto } from "@/dtos/auth/response/Sign-in.response.dto";

export const signUpRequest = async (
  dto: SignUpRequestDto
): Promise<ResponseDto<void>> => {
  try {
    const response = await axiosInstance.post(SIGN_UP_URL, dto);
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const checkLoginIdDuplicate = async (
  loginId: string
): Promise<ResponseDto<void>> => {
  try {
    const response = await axiosInstance.get(
      CHECK_DUPLICATE_LOGIN_ID + `?loginId=${loginId}`
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const checkEmailDuplicate = async (
  email: string
): Promise<ResponseDto<void>> => {
  try {
    const response = await axiosInstance.get(
      CHECK_DUPLICATE_EMAIL + `?email=${email}`
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const checkPhoneNumberDuplicate = async (
  phoneNumber: string
): Promise<ResponseDto<void>> => {
  try {
    const response = await axiosInstance.get(
      CHECK_DUPLICATE_PHONE_NUMBER + `?phoneNumber=${phoneNumber}`
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const signInRequest = async (
  dto: SignInRequestDto
): Promise<ResponseDto<SignInResponseDto>> => {
  try {
    const response = await axiosInstance.post(SIGN_IN_URL, dto);
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const loginIdFindSendEmailRequest = async (
  dto: LoginIdFindSendEmailRequestDto
): Promise<ResponseDto<string>> => {
  try {
    const response = await axiosInstance.post(LOGIN_ID_FIND_EMAIL_RUL, dto);
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const loginIdFindRequest = async (
  token: string
): Promise<ResponseDto<string>> => {
  try {
    const response = await axiosInstance.get(
      GET_LOGIN_ID_URL + `?token=${token}`
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const passwordChangeSendEmailRequest = async (
  dto: PasswordChangeSendEmailRequestDto
): Promise<ResponseDto<string>> => {
  try {
    const response = await axiosInstance.post(PASSWORD_CHANGE_EMAIL_URL, dto);
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const passwordChangeRequest = async (
  token: string,
  dto: PasswordChangeRequestDto
): Promise<ResponseDto<string>> => {
  try {
    const response = await axiosInstance.put(
      PASSWORD_CHANGE_URL + `?token=${token}`,
      dto
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const verifyPasswordChangeToken = async (
  token: string
): Promise<ResponseDto<string>> => {
  try {
    const response = await axiosInstance.get(
      PASSWORD_CHANGE_URL + `?token=${token}`
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const logoutRequest = async (): Promise<ResponseDto<void>> => {
  try {
    const response = await axiosInstance.post(LOGOUT_URL);
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const signUpResultRequest = async (
  approvalId: number
): Promise<ResponseDto<string>> => {
  try {
    const response = await axiosInstance.post(SIGN_UP_RESULT_URL(approvalId));
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const verifyTokenEmployee = async (
  token: string
): Promise<ResponseDto<string>> => {
  try {
    const response = await axiosInstance.get(
      PUT_EMPLOYEE_URL + `?token=${token}`
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const employeeUpdateRequest = async (
  token: string,
  dto: EmployeeUpdateRequestDto
): Promise<ResponseDto<string>> => {
  try {
    const response = await axiosInstance.put(
      PUT_EMPLOYEE_URL + `?token=${token}`,
      dto
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};
