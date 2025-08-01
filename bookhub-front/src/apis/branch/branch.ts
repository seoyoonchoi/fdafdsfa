import { ResponseDto } from "@/dtos";
import {
  axiosInstance,
  bearerAuthorization,
  responseErrorHandler,
  responseSuccessHandler,
} from "../axiosConfig";
import {
  GET_ALL_BRANCH_URL,
  GET_BRANCH_DETAIL_URL,
  GET_SEARCH_BRANCH_URL,
  POST_BRANCH_URL,
  PUT_BRANCH_URL,
} from "./branchUrl";
import { AxiosError } from "axios";
import { BranchSearchParams } from "@/dtos/branch/request/Branch-search-params";
import { BranchSearchResponseDto } from "@/dtos/branch/response/Branch-search.response.dto";
import { BranchDetailResponseDto } from "@/dtos/branch/response/Branch-detail.response.dto";
import { BranchCreateRequestDto } from "@/dtos/branch/request/Branch-create.request.dto";
import { BranchUpdateRequestDto } from "@/dtos/branch/request/Branch-update.request.dto";
import { PageResponseDto } from "@/dtos/PageResponseDto";

export const branchRequest = async (): Promise<
  ResponseDto<BranchSearchResponseDto[]>
> => {
  try {
    const response = await axiosInstance.get(GET_ALL_BRANCH_URL);
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const branchSearchRequest = async (
  params: BranchSearchParams,
  accessToken: string
): Promise<ResponseDto<PageResponseDto<BranchSearchResponseDto>>> => {
  try {
    const response = await axiosInstance.get(GET_SEARCH_BRANCH_URL, {
      params,
      ...bearerAuthorization(accessToken),
    });
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const branchDetailRequest = async (
  branchId: number,
  accessToken: string
): Promise<ResponseDto<BranchDetailResponseDto>> => {
  try {
    const response = await axiosInstance.get(
      GET_BRANCH_DETAIL_URL(branchId),
      bearerAuthorization(accessToken)
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const branchCreateRequest = async (
  dto: BranchCreateRequestDto,
  accessToken: string
): Promise<ResponseDto<void>> => {
  try {
    const response = await axiosInstance.post(
      POST_BRANCH_URL,
      dto,
      bearerAuthorization(accessToken)
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const branchUpdateRequest = async (
  branchId: number,
  dto: BranchUpdateRequestDto,
  accessToken: string
): Promise<ResponseDto<void>> => {
  try {
    const response = await axiosInstance.put(
      PUT_BRANCH_URL(branchId),
      dto,
      bearerAuthorization(accessToken)
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};
