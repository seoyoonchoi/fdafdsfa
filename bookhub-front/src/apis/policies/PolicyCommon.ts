import { PolicyDetailResponseDto, PolicyListResponseDto } from "@/dtos/policy/Policy.response.dto";
import { PolicyType } from "../enums/PolicyType";
import { AxiosError, AxiosResponse } from "axios";
import { GET_FILTERED_POLICIES_URL, GET_POLICY_URL } from "./PolicyUrl";
import { ResponseDto } from "@/dtos";
import { PageResponseDto } from "@/dtos/PageResponseDto";
import { axiosInstance, responseSuccessHandler, responseErrorHandler, bearerAuthorization } from "../axiosConfig";

export const getPolicies = async (
    accessToken: string,
    page: number,
    size: number,
    keyword?: string,
    type? : PolicyType,
    start? : string,
    end? : string
): Promise<
    ResponseDto<
        PageResponseDto<PolicyListResponseDto>>> => {
    try {
        const response : AxiosResponse<ResponseDto<
        PageResponseDto<PolicyListResponseDto>>> = await axiosInstance.get(GET_FILTERED_POLICIES_URL,{
            params:{page, size,keyword,type,start,end},
            headers: {Authorization: `Bearer ${accessToken}`},
        });
        return responseSuccessHandler(response);
    } catch (error) {
        return responseErrorHandler(error as AxiosError<ResponseDto<
        PageResponseDto<PolicyListResponseDto>>>);
    }
};

export const getPolicyDetail = async(
    policyId: number,
    accessToken : string
): Promise<ResponseDto<PolicyDetailResponseDto>> => {
    try{
        const response = await axiosInstance.get(
            GET_POLICY_URL(policyId),
            bearerAuthorization(accessToken)
        );
        return responseSuccessHandler(response);
    }catch (error){
        return responseErrorHandler(error as AxiosError<ResponseDto<PolicyDetailResponseDto>>);
    }
}

