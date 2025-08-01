export interface PurchaseOrderApprovalSearchParams {
  page: number;
  size: number;
  employeeName: string;
  isApproved: Boolean | undefined;
  startUpdatedAt: string;
  endUpdatedAt: string;
}
