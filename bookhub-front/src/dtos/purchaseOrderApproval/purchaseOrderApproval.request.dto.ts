import { PurchaseOrderStatus } from "@/apis/enums/PurchaseOrderStatus";


export interface PurchaseOrderApproveRequestDto {
  status: PurchaseOrderStatus;
}