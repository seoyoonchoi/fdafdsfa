import { ADMIN_URL, COMMON_URL } from "../constants/constants";

const POLICY_MODULE_ADMIN = `${ADMIN_URL}/policies`;
export const POST_POLICY_URL = `${POLICY_MODULE_ADMIN}`;
export const PUT_POLICY_URL = (policyId : number) => `${POLICY_MODULE_ADMIN}/${policyId}`;
export const DELETE_POLICY_URL = (policyId : number) => `${POLICY_MODULE_ADMIN}/${policyId}`;


const POLICY_MODULE_COMMON = `${COMMON_URL}/policies`;
export const GET_FILTERED_POLICIES_URL = `${POLICY_MODULE_COMMON}`;
export const GET_POLICY_URL = (policyId : number) => `${POLICY_MODULE_COMMON}/${policyId}`;