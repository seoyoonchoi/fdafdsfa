import { ResponseDto } from "@/dtos";
import { PolicyCreateRequestDto, PolicyUpdateRequestDto } from "@/dtos/policy/Policy.request.dto";
import { PolicyListResponseDto } from "@/dtos/policy/Policy.response.dto";
import { axiosInstance, bearerAuthorization, responseErrorHandler, responseSuccessHandler } from "../axiosConfig";
import { DELETE_POLICY_URL, POST_POLICY_URL, PUT_POLICY_URL } from "./PolicyUrl";
import { AxiosError } from "axios";

export const createPolicy = async(
    dto: PolicyCreateRequestDto,
    accessToken: string
): Promise<ResponseDto<PolicyListResponseDto>> => {
    try{
        const response = await axiosInstance.post(
            POST_POLICY_URL,
            dto,
            bearerAuthorization(accessToken)
        );
        return responseSuccessHandler(response);
    }catch(error){
        return responseErrorHandler(error as AxiosError<ResponseDto<PolicyListResponseDto>>);
    }
};

export const updatePolicy = async(
    policyId : number,
    dto: PolicyUpdateRequestDto,
    accessToken: string
): Promise<ResponseDto<PolicyListResponseDto>> => {
    try{
        const response = await axiosInstance.put(
            PUT_POLICY_URL(policyId),
            dto,
            bearerAuthorization(accessToken)
        );
        return responseSuccessHandler(response);
    }catch(error){
        return responseErrorHandler(error as AxiosError<ResponseDto<PolicyListResponseDto>>);
    }
};

export const deletePolicy = async(
    policyId : number,
    accessToken: string
): Promise<ResponseDto<null>> => {
    try{
        const response = await axiosInstance.delete(
            DELETE_POLICY_URL(policyId),
            bearerAuthorization(accessToken)
        );
        return responseSuccessHandler(response);
    }catch(error){
        return responseErrorHandler(error as AxiosError<ResponseDto<null>>);
    }
};
