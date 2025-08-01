export interface PurchaseOrderRequestDto{
    isbn: string;
    purchaseOrderAmount: number;
}

export interface PurchaseOrderCreateRequestDto{
    purchaseOrders : PurchaseOrderRequestDto[];
}