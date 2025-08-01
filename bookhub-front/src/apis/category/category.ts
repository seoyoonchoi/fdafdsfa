import { ResponseDto } from "@/dtos";
import { CategoryCreateRequestDto, CategoryUpdateRequestDto } from "@/dtos/category/request/Category.request.dto";
import { CategoryCreateResponseDto, CategoryTreeResponseDto } from "@/dtos/category/response/Category.response.dto";
import { axiosInstance, bearerAuthorization, responseErrorHandler, responseSuccessHandler } from "../axiosConfig";
import { DELETE_CATEGORY_URL, GET_CATEGORY_TREE_URL, GET_POLICY_BY_CATEGORYID_URL, GET_ROOT_CATEGORY_URL, POST_CATEGORY_URL, PUT_CATEGORY_URL } from "./categoryUrl";
import { Axios, AxiosError } from "axios";
import { CategoryType } from "../enums/CategoryType";

export const createCategory = async(
  dto: CategoryCreateRequestDto,
  accessToken: string
): Promise<ResponseDto<CategoryCreateResponseDto>> => {
  try {
    const response = await axiosInstance.post(POST_CATEGORY_URL, dto, bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const getRootCategories = async(
  accessToken: string
): Promise<ResponseDto<CategoryTreeResponseDto[]>> => {
  try {
    const response = await axiosInstance.get(GET_ROOT_CATEGORY_URL, bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const getCategoryTree = async (
  type: CategoryType,
  accessToken: string
): Promise<ResponseDto<CategoryTreeResponseDto[]>> => {
  try {
    const response = await axiosInstance.get(
      GET_CATEGORY_TREE_URL(type),
      bearerAuthorization(accessToken)
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const updateCategory = async (
  categoryId: number,
  dto: CategoryUpdateRequestDto,
  accessToken: string
): Promise<ResponseDto<CategoryCreateResponseDto>> => {
  try {
    const response = await axiosInstance.put(PUT_CATEGORY_URL(categoryId), dto, bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const deleteCategory = async (
  CategoryId: number,
  accessToken: string
): Promise<ResponseDto<void>> => {
  try {
    const response = await axiosInstance.delete(DELETE_CATEGORY_URL(CategoryId), bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>)
  }
};

export const getPolicyByCategory = async (
  categoryId: number,
  accessToken: string
): Promise<ResponseDto<void>> => {
  try {
    const response = await axiosInstance.get(GET_POLICY_BY_CATEGORYID_URL(categoryId), bearerAuthorization(accessToken));
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>)
  }
};