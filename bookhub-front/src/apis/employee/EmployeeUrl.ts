import { ADMIN_URL } from "../constants/constants";

const EMPLOYEE_MODULE_ADMIN = `${ADMIN_URL}/employees`;

export const PUT_EMPLOYEE_CHANGE_URL = (employeeId: number) =>
  `${EMPLOYEE_MODULE_ADMIN}/${employeeId}/organization-update`;

export const PUT_EMPLOYEE_STATUS_URL = (employeeId: number) =>
  `${EMPLOYEE_MODULE_ADMIN}/${employeeId}/status`;

export const PUT_EMPLOYEE_APPROVE_URL = (employeeId: number) =>
  `${EMPLOYEE_MODULE_ADMIN}/${employeeId}/approval`;

export const GET_ALL_EMPLOYEE_URL = `${EMPLOYEE_MODULE_ADMIN}`;
export const GET_EMPLOYEE_DETAIL_URL = (employeeId: number) =>
  `${EMPLOYEE_MODULE_ADMIN}/${employeeId}`;
export const GET_PENDING_EMPLOYEE_URL = `${EMPLOYEE_MODULE_ADMIN}/approval`;
