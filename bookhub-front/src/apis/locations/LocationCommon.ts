import { ResponseDto } from "@/dtos";

import { PageResponseDto } from "@/dtos/PageResponseDto";
import { AxiosError, AxiosResponse } from "axios";
import { GET_FILTERED_LOCATIONS_URL, GET_LOCATION_URL } from "./LocationUrl";
import { axiosInstance, bearerAuthorization, responseErrorHandler, responseSuccessHandler } from "../axiosConfig";
import { LocationResponseDto } from "@/dtos/locations/Location.response.dto";

export const getLocations= async (
    accessToken: string,
    page: number,
    size: number,
    bookTitle?: string,
    isbn? : string,
    branchId? : number //이거 토글로 할건데 어떻게 할지 생각해보기 (branchrepo에서 받아와야하나?)
): Promise<
    ResponseDto<
        PageResponseDto<LocationResponseDto>>> => {
    try {
        const response : AxiosResponse<ResponseDto<
        PageResponseDto<LocationResponseDto>>> = await axiosInstance.get(GET_FILTERED_LOCATIONS_URL,{
            params:{page, size,bookTitle, isbn, branchId},
            headers: {Authorization: `Bearer ${accessToken}`},
        });
        return responseSuccessHandler(response);
    } catch (error) {
        return responseErrorHandler(error as AxiosError<ResponseDto<
        PageResponseDto<LocationResponseDto>>>);
    }
};

export const getLocationDetail = async(
    locationId: number,
    accessToken: string
): Promise<ResponseDto<LocationResponseDto>> => {
    try{
        const response = await axiosInstance.get(
            GET_LOCATION_URL(locationId),
            bearerAuthorization(accessToken)
        );
        return responseSuccessHandler(response);

    }catch(error){
        return responseErrorHandler(error as AxiosError<ResponseDto<LocationResponseDto>>);
    }
}