export interface PurchaseOrderResponseDto{
    purchaseOrderId : number;
    branchName: string;
    branchLocation: string;
    employeeName : string;
    isbn: string;
    bookTitle: string;
    bookPrice : number;
    purchaseOrderAmount: number;
    purchaseOrderPrice: number;
    purchaseOrderStatus: string;
    purchaseOrderDateAt: string;
}