import { ADMIN_URL } from "../constants/constants";
import { PurchaseOrderStatus } from "../enums/PurchaseOrderStatus";

export const PURCHASE_APPROVAL_MODULE_URL_ADMIN = `${ADMIN_URL}/purchase-order-approvals`;

export const PUT_PURCHASE_ORDER_STATUS_URL = (purchaseOrderId: number) =>
  `${PURCHASE_APPROVAL_MODULE_URL_ADMIN}/approval/${purchaseOrderId}`;

export const GET_ALL_PURCHASE_ORDER_REQUESTED_URL = `${PURCHASE_APPROVAL_MODULE_URL_ADMIN}/requested`;
