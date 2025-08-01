import { ResponseDto } from "@/dtos";
import {
  axiosInstance,
  responseErrorHandler,
  responseSuccessHandler,
} from "../axiosConfig";
import { GET_ALL_POSITION_URL } from "./positionUrl";
import { AxiosError } from "axios";
import { PositionListResponseDto } from "@/dtos/position/Position-list.response.dto";

export const positionRequest = async (): Promise<
  ResponseDto<PositionListResponseDto[]>
> => {
  try {
    const response = await axiosInstance.get(GET_ALL_POSITION_URL);
    return responseSuccessHandler(response);
  } catch (error) {
    return responseErrorHandler(error as AxiosError<ResponseDto>);
  }
};
