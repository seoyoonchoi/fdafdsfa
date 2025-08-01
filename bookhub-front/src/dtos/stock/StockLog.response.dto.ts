import { StockActionType } from "@/apis/enums/StockActionType";

export interface StockLogResponseDto{
    stockLogId: number;
    type: StockActionType;
    employeeName: string;
    bookTitle: string;
    branchName: string;
    amount: number;
    bookAmount: number;
    actionDate: string;
    description: string;
}

