import { ADMIN_URL, COMMON_URL } from "../constants/constants";

const BOOK_ADMIN_MODULE_URL = `${ADMIN_URL}/books`
const BOOK_COMMON_MODULE_URL = `${COMMON_URL}/books`

export const POST_BOOK_URL = `${BOOK_ADMIN_MODULE_URL}`;
export const GET_BOOK_URL = `${BOOK_COMMON_MODULE_URL}/search`
export const UPDATE_BOOK_URL = (isbn : string) => `${BOOK_ADMIN_MODULE_URL}/${isbn}`;
export const HIDE_BOOK_URL = (isbn : string) => `${BOOK_ADMIN_MODULE_URL}/hidden/${isbn}`;
