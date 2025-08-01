import { ADMIN_URL, MANAGER_URL } from "../constants/constants";

const RECEPTION_ADMIN_MODULE_URL = `${ADMIN_URL}/reception`;
const RECEPTION_MANAGER_MODULE_URL = `${MANAGER_URL}/reception`;

export const PUT_RECEPTION_URL = (purchaseOrderApprovalId : number) => `${RECEPTION_MANAGER_MODULE_URL}/approve/${purchaseOrderApprovalId}`;
export const GET_PENDING_RECEPTION_URL = `${RECEPTION_MANAGER_MODULE_URL}/pending`;
export const GET_CONFIRMED_RECEPTION_URL = `${RECEPTION_MANAGER_MODULE_URL}/confirmed`;
export const GET_ADMIN_RECEPTION_URL = `${RECEPTION_ADMIN_MODULE_URL}/logs`;