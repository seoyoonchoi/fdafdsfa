import { StockActionType } from "@/apis/enums/StockActionType";

export interface StockResponseDto{
    stockId: number;
    branchId: number;
    isbn : string;
    branchName: string;
    bookTitle: string;
    amount : number;
}

export interface StockUpdateResponseDto{
    stockId: number;
    branchName: string;
    type: StockActionType;
    bookTitle: string;
    amount: number;
    bookAmount: number;
}