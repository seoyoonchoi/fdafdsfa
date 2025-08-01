const API_DOMAIN = import.meta.env.REACT_APP_API_DOMAIN || "http://localhost:8080";

const BASE_URL = "api/v2";

export const AUTH_URL = `${API_DOMAIN}/${BASE_URL}/auth`;
export const COMMON_URL = `${API_DOMAIN}/${BASE_URL}/common`;
export const MANAGER_URL = `${API_DOMAIN}/${BASE_URL}/manager`;
export const ADMIN_URL = `${API_DOMAIN}/${BASE_URL}/admin`;