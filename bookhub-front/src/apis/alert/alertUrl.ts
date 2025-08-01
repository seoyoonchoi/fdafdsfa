import { COMMON_URL } from "../constants/constants";

const ALERT_MODULE_URL = `${COMMON_URL}/alerts`;

export const GET_ALERT_URL = `${ALERT_MODULE_URL}/all/{employeeId}`;
export const GET_UNREAD_ALERT_URL = `${ALERT_MODULE_URL}/unread/{employeeId}`;
export const PUT_ALERT_URL = `${ALERT_MODULE_URL}/read`;
export const GET_UNREAD_ALERT_COUNT_URL = `${ALERT_MODULE_URL}/unread-count?employeeId={employeeId}`;