import { AUTH_URL } from "../constants/constants";

export const SIGN_UP_URL = `${AUTH_URL}/signup`;
export const SIGN_IN_URL = `${AUTH_URL}/login`;
export const CHECK_DUPLICATE_LOGIN_ID = `${AUTH_URL}/login-id-exists`;
export const CHECK_DUPLICATE_EMAIL = `${AUTH_URL}/email-exists`;
export const CHECK_DUPLICATE_PHONE_NUMBER = `${AUTH_URL}/phone-number-exists`;

export const LOGIN_ID_FIND_EMAIL_RUL = `${AUTH_URL}/login-id-find/email`;
export const GET_LOGIN_ID_URL = `${AUTH_URL}/login-id-find`;

export const PASSWORD_CHANGE_EMAIL_URL = `${AUTH_URL}/password-change/email`;
export const PASSWORD_CHANGE_URL = `${AUTH_URL}/password-change`

export const LOGOUT_URL = `${AUTH_URL}/logout`
export const SIGN_UP_RESULT_URL = (approvalId: number) => `${AUTH_URL}/employees/${approvalId}/approve`;

export const PUT_EMPLOYEE_URL = `${AUTH_URL}/employees/approve`;