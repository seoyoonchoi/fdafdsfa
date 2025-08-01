import { ResponseDto } from "@/dtos"
import { PublisherListResponseDto, PublisherResponseDto } from "@/dtos/publishers/publisher.response.dto"
import { DELETE_PUBLISHER_URL, GET_ALL_PUBLISHER_URL, GET_PUBLISHER_URL, POST_PUBLISHER_URL, PUT_PUBLISHER_URL } from "./publisherUrl"
import { axiosInstance, bearerAuthorization, responseErrorHandler, responseSuccessHandler } from "../axiosConfig"
import { AxiosError } from "axios";
import { PublisherRequestDto } from "@/dtos/publishers/publisher.request.dto";
import { PageResponseDto } from "@/dtos/PageResponseDto";


export const createPublisher = async (
    dto: PublisherRequestDto,
    accessToken: string
): Promise<ResponseDto<PublisherResponseDto>> => {
    try {
        const response = await axiosInstance.post(
            POST_PUBLISHER_URL,
            dto,
            bearerAuthorization(accessToken)
        );
        return responseSuccessHandler(response);
    } catch (error) {
        return responseErrorHandler(
            error as AxiosError<ResponseDto<PublisherResponseDto>>
        );
    }
};

export const updatePublisher = async (
    publisherId: number,
    dto: PublisherRequestDto,
    accessToken: string
): Promise<ResponseDto<PublisherResponseDto>> => {
    try {
        const response = await axiosInstance.put(
            PUT_PUBLISHER_URL(publisherId),
            dto,
            bearerAuthorization(accessToken)
        );
        return responseSuccessHandler(response);
    } catch (error) {
        return responseErrorHandler(
            error as AxiosError<ResponseDto<PublisherResponseDto>>
        );
    }
};

export const deletePublisher = async (
    publisherId: number,
    accessToken: string
): Promise<ResponseDto<null>> => {
    try {
        const response = await axiosInstance.delete(
            DELETE_PUBLISHER_URL(publisherId),
            bearerAuthorization(accessToken)
        );
        return responseSuccessHandler(response);
    } catch (error) {
        return responseErrorHandler(
            error as AxiosError<ResponseDto<null>>
        );
    }
};

export const getPublishers = async(
    accessToken : string,
    page: number,
    size : number,
    keyword? : string
): Promise<
ResponseDto<
PageResponseDto<PublisherResponseDto>| PublisherResponseDto[]>> => {
 try{
    let url = `${GET_ALL_PUBLISHER_URL}?page=${page}&size=${size}`;
    if(keyword && keyword.trim() ! == ''){
        url += `&keyword=${encodeURIComponent(keyword.trim())}`;
    }
    const response = await axiosInstance.get(
        url,
        bearerAuthorization(accessToken)
    );
    return responseSuccessHandler(response);
 }   catch(error){
    return responseErrorHandler(
        error as AxiosError<ResponseDto<PageResponseDto<PublisherResponseDto>| PublisherResponseDto[]>>
    );
 }
}

export const getPublisher = async(
    
    publisherId : number,
    accessToken : string
): Promise<
ResponseDto<PublisherResponseDto>> => {
    try{
        const response = await axiosInstance.get(
            GET_PUBLISHER_URL(publisherId),
            bearerAuthorization(accessToken)
        );
        return responseSuccessHandler(response);

    }catch(error){
        return responseErrorHandler(
            error as AxiosError<ResponseDto<PublisherResponseDto>>
        )
    }
}