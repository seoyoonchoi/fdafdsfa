import { ADMIN_URL, COMMON_URL } from "../constants/constants";

const CATEGORY_MODULE_URL = `${ADMIN_URL}/categories`;

export const POST_CATEGORY_URL = `${CATEGORY_MODULE_URL}`;
export const GET_CATEGORY_TREE_URL = (type: "DOMESTIC" | "FOREIGN") => `${CATEGORY_MODULE_URL}/tree?type=${type}`;
export const GET_ROOT_CATEGORY_URL = `${CATEGORY_MODULE_URL}/roots`;
export const PUT_CATEGORY_URL = (categoryId : number) => `${CATEGORY_MODULE_URL}/${categoryId}`;
export const DELETE_CATEGORY_URL = (categoryId : number) => `${CATEGORY_MODULE_URL}/${categoryId}`;
export const GET_POLICY_BY_CATEGORYID_URL = (categoryId : number) => `${COMMON_URL}/categories/${categoryId}/policy`;