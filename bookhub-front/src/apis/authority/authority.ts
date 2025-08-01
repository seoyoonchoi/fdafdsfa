import { ResponseDto } from "@/dtos";
import { axiosInstance, responseErrorHandler, responseSuccessHandler } from "../axiosConfig";
import { AxiosError } from "axios";
import { GET_ALL_AUTHORITY_URL } from "./authorityUrl";
import { AuthorityListResponseDto } from "@/dtos/authority/Authority-list.response.dto";

export const authorityRequest = async (): Promise<
  ResponseDto<AuthorityListResponseDto[]>
> => {
  try {
    const response = await axiosInstance.get(GET_ALL_AUTHORITY_URL);
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};