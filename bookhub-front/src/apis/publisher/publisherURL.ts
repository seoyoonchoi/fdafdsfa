import { ADMIN_URL } from "../constants/constants";

const PUBLISHER_MODULE_URL = `${ADMIN_URL}/publishers`;

export const POST_PUBLISHER_URL = `${PUBLISHER_MODULE_URL}`;
export const PUT_PUBLISHER_URL = (publisherId : number) => `${PUBLISHER_MODULE_URL}/${publisherId}`;
export const DELETE_PUBLISHER_URL = (publisherId : number) => `${PUBLISHER_MODULE_URL}/${publisherId}`;
export const GET_ALL_PUBLISHER_URL = `${PUBLISHER_MODULE_URL}`;
export const GET_PUBLISHER_URL = (publisherId : number) => `${PUBLISHER_MODULE_URL}/${publisherId}`;
