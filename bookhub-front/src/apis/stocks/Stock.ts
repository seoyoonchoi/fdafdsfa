import { ResponseDto } from "@/dtos";
import { StockUpdateRequestDto } from "@/dtos/stock/Stock.request.dto";
import { StockResponseDto, StockUpdateResponseDto } from "@/dtos/stock/Stock.response.dto";
import { GET_FILTERED_STOCKS_URL, GET_STOCK_URL, PUT_STOCK_URL } from "./StockUrl";
import { axiosInstance, bearerAuthorization, responseErrorHandler, responseSuccessHandler } from "../axiosConfig";
import { AxiosError, AxiosResponse } from "axios";
import { PageResponseDto } from "@/dtos/PageResponseDto";

export const updateStock = async(
    
    stockId : number,
    dto : StockUpdateRequestDto,
    accessToken : string
) : Promise<ResponseDto<StockUpdateResponseDto>> =>{
    try{
        const response = await axiosInstance.put(
            PUT_STOCK_URL( stockId),
            dto,
            bearerAuthorization(accessToken)
        );
        return responseSuccessHandler(response);
    }catch(error){
        return responseErrorHandler(error as AxiosError<ResponseDto<StockUpdateResponseDto>>);
    }
}

export const getStocks= async (
    accessToken: string,
    page: number,
    size: number,
    bookTitle?: string,
    isbn? : string,
    branchId? : number 
): Promise<
    ResponseDto<
        PageResponseDto<StockResponseDto>>> => {
    try {
        const response : AxiosResponse<ResponseDto<
        PageResponseDto<StockResponseDto>>> = await axiosInstance.get(GET_FILTERED_STOCKS_URL,{
            params:{page, size, bookTitle, isbn, branchId},
            headers: {Authorization: `Bearer ${accessToken}`},
        });
        return responseSuccessHandler(response);
    } catch (error) {
        return responseErrorHandler(error as AxiosError<ResponseDto<
        PageResponseDto<StockResponseDto>>>);
    }
};

export const getStockById= async(
    stockId:number,
    accessToken: string
    
):Promise<ResponseDto<StockResponseDto>> => {
    try{
        const response = await axiosInstance.get(
            GET_STOCK_URL(stockId),
            bearerAuthorization(accessToken)
        );
        return responseSuccessHandler(response);
    }catch(error){
        return responseErrorHandler(error as AxiosError<ResponseDto<StockResponseDto>>);
    }
}