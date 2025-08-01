import { ResponseDto } from "@/dtos";
import { AuthorCreateRequestDto } from "@/dtos/author/request/Author-create.request.dto";
import {
  axiosInstance,
  bearerAuthorization,
  responseErrorHandler,
  responseSuccessHandler,
} from "../axiosConfig";
import {
  CHECK_DUPLICATE_AUTHOR_EMAIL,
  DELETE_AUTHOR_URL,
  GET_ALL_AUTHOR_BY_NAME_URL,
  GET_ALL_AUTHOR_URL,
  POST_AUTHOR_URL,
  PUT_AUTHOR_URL,
} from "./authorUrl";
import { AxiosError } from "axios";
import { AuthorResponseDto } from "@/dtos/author/response/Author.response.dto";
import { AuthorRequestDto } from "@/dtos/author/request/Author.request.dto";
import { PageResponseDto } from "@/dtos/PageResponseDto";
import { AuthorSearchParams } from "@/dtos/author/request/Author-search-params";

export const createAuthor = async (
  dto: AuthorCreateRequestDto,
  accessToken: string
): Promise<ResponseDto<void>> => {
  try {
    const response = await axiosInstance.post(
      POST_AUTHOR_URL,
      dto,
      bearerAuthorization(accessToken)
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const checkDuplicateAuthorEmail = async (
  authorEmail: string,
  accessToken: string
): Promise<ResponseDto<void>> => {
  try {
    const response = await axiosInstance.get(
      CHECK_DUPLICATE_AUTHOR_EMAIL + `?authorEmail=${authorEmail}`,
      bearerAuthorization(accessToken)
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const getAllAuthorsByName = async (
  params: AuthorSearchParams,
  accessToken: string
): Promise<ResponseDto<PageResponseDto<AuthorResponseDto>>> => {
  try {
    const response = await axiosInstance.get(GET_ALL_AUTHOR_BY_NAME_URL, {
      params,
      ...bearerAuthorization(accessToken),
    });
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const updateAuthor = async (
  authorId: number,
  dto: AuthorRequestDto,
  accessToken: string
): Promise<ResponseDto<void>> => {
  try {
    const response = await axiosInstance.put(
      PUT_AUTHOR_URL(authorId),
      dto,
      bearerAuthorization(accessToken)
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};

export const deleteAuthor = async (
  authorId: number,
  accessToken: string
): Promise<ResponseDto<void>> => {
  try {
    const response = await axiosInstance.delete(
      DELETE_AUTHOR_URL(authorId),
      bearerAuthorization(accessToken)
    );
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};
