import { ResponseDto } from "@/dtos";
import { PageResponseDto } from "@/dtos/PageResponseDto";
import { StockLogResponseDto } from "@/dtos/stock/StockLog.response.dto";
import { AxiosResponse, AxiosError } from "axios";
import { axiosInstance, responseSuccessHandler, responseErrorHandler, bearerAuthorization } from "../axiosConfig";
import { StockActionType } from "../enums/StockActionType";
import { GET_FILTERED_STOCK_LOGS_URL, GET_STOCK_LOG_URL } from "./StockUrl";

export const getStockLogs= async (
    accessToken: string,
    page: number,
    size: number,
    bookTitle?: string,
    branchId? : number, //이거 토글로 할건데 어떻게 할지 생각해보기 (branchrepo에서 받아와야하나?)
    type? : StockActionType,
    start? : string,
    end? :string
): Promise<
    ResponseDto<
        PageResponseDto<StockLogResponseDto>>> => {
    try {
        const response : AxiosResponse<ResponseDto<
        PageResponseDto<StockLogResponseDto>>> = await axiosInstance.get(GET_FILTERED_STOCK_LOGS_URL,{
            params:{page, size, bookTitle, branchId, type, start, end},
            headers: {Authorization: `Bearer ${accessToken}`},
        });
        return responseSuccessHandler(response);
    } catch (error) {
        return responseErrorHandler(error as AxiosError<ResponseDto<
        PageResponseDto<StockLogResponseDto>>>);
    }
};

export const getStockLogDetail = async (
    stockLogId : number,
    accessToken : string
) : Promise<ResponseDto<StockLogResponseDto>> => {
    try{
        const response = await axiosInstance.get(
            GET_STOCK_LOG_URL(stockLogId),
            bearerAuthorization(accessToken)
        );
        return responseSuccessHandler(response);        
    }catch(error){
        return responseErrorHandler(error as AxiosError<ResponseDto<StockLogResponseDto>>); 
    }
}