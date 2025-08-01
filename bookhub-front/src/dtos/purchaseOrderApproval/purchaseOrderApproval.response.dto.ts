import { PurchaseOrderStatus } from "@/apis/enums/PurchaseOrderStatus";

export interface PurchaseOrderApprovalResponseDto {
  purchaseOrderApprovalId: number;
  isApproved: boolean;
  approvedDateAt: string; 
  employeeName: string;
  poDetail: {
    branchName: string;
    employeeName: string;
    isbn: string;
    bookTitle: string;
    bookPrice: number;
    purchaseOrderAmount: number;
    purchaseOrderStatus: PurchaseOrderStatus;
  };
}
