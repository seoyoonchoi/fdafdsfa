import { COMMON_URL, MANAGER_URL } from "../constants/constants";

const LOCATION_MODULE_MANAGER = `${MANAGER_URL}/branch`

export const POST_LOCATION_URL = (branchId: number) => `${LOCATION_MODULE_MANAGER}/${branchId}`;
export const PUT_LOCATION_URL = (branchId: number, locationId : number) => `${LOCATION_MODULE_MANAGER}/${branchId}/locations/${locationId}`;
export const DELETE_LOCATION_URL = (branchId: number, locationId : number) =>`${LOCATION_MODULE_MANAGER}/${branchId}/locations/${locationId}`;

const LOCATION_MODULE_COMMON = `${COMMON_URL}/locations`;
export const GET_FILTERED_LOCATIONS_URL = `${LOCATION_MODULE_COMMON}`
export const GET_LOCATION_URL = (locationId : number) => `${LOCATION_MODULE_COMMON}/${locationId}`;