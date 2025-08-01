import { ADMIN_URL, AUTH_URL } from "../constants/constants";

const BRANCH_ADMIN_MODULE_URL = `${ADMIN_URL}/branches`;
const BRANCH_AUTH_MODULE_URL = `${AUTH_URL}/branches`;

export const POST_BRANCH_URL = `${BRANCH_ADMIN_MODULE_URL}`;
export const PUT_BRANCH_URL = (branchId: number) =>
  `${BRANCH_ADMIN_MODULE_URL}/${branchId}`;
export const GET_ALL_BRANCH_URL = `${BRANCH_AUTH_MODULE_URL}`
export const GET_SEARCH_BRANCH_URL = `${BRANCH_ADMIN_MODULE_URL}`;
export const GET_BRANCH_DETAIL_URL = (branchId: number) =>
  `${BRANCH_ADMIN_MODULE_URL}/${branchId}`;
