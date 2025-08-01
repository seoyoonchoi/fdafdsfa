import { MANAGER_URL } from "../constants/constants";
import { PurchaseOrderStatus } from "../enums/PurchaseOrderStatus";

const PURCHASE_ORDER_MODULE_URL_MANAGER = `${MANAGER_URL}/purchase-orders`;

export const POST_PURCHASE_ORDER_URL = `${PURCHASE_ORDER_MODULE_URL_MANAGER}`;

export const GET_PURCHASE_ORDER_URL = (purchaseOrderId: number) => `${PURCHASE_ORDER_MODULE_URL_MANAGER}/${purchaseOrderId}`;

export const PUT_PURCHASE_ORDER_URL = (purchaseOrderId: number) => `${PURCHASE_ORDER_MODULE_URL_MANAGER}/${purchaseOrderId}`;

export const DELETE_PURCHASE_ORDER_URL = (purchaseOrderId: number) => `${PURCHASE_ORDER_MODULE_URL_MANAGER}/${purchaseOrderId}`;

export const GET_PURCHASE_ORDER_BY_CRITERIA = (
  employeeName: string,
  bookIsbn: string,
  purchaseOrderStatus: PurchaseOrderStatus | null
) => {
  const queryParams = new URLSearchParams();
  
  if (employeeName) queryParams.append("employeeName", employeeName);
  if (bookIsbn) queryParams.append("bookIsbn", bookIsbn);
  if (purchaseOrderStatus) queryParams.append("purchaseOrderStatus", purchaseOrderStatus);

  const query =queryParams.toString();
  
  return `${PURCHASE_ORDER_MODULE_URL_MANAGER}?${query}`;
};