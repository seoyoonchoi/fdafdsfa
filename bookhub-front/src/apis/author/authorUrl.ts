import { ADMIN_URL } from "../constants/constants";

const AUTHOR_ADMIN_MODULE_UR = `${ADMIN_URL}/authors`;

export const POST_AUTHOR_URL = `${AUTHOR_ADMIN_MODULE_UR}`;
export const PUT_AUTHOR_URL = (authorId: number) =>
  `${AUTHOR_ADMIN_MODULE_UR}/${authorId}`;
export const DELETE_AUTHOR_URL = (authorId: number) =>
  `${AUTHOR_ADMIN_MODULE_UR}/${authorId}`;
export const GET_ALL_AUTHOR_URL = `${AUTHOR_ADMIN_MODULE_UR}`;
export const GET_AUTHOR_URL = (authorId: number) =>
  `${AUTHOR_ADMIN_MODULE_UR}/${authorId}`;
export const GET_ALL_AUTHOR_BY_NAME_URL = `${AUTHOR_ADMIN_MODULE_UR}`;
export const CHECK_DUPLICATE_AUTHOR_EMAIL = `${AUTHOR_ADMIN_MODULE_UR}/email-exists`;
