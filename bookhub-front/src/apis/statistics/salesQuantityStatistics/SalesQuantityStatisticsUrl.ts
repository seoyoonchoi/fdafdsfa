import { ADMIN_URL, MANAGER_URL } from "@/apis/constants/constants";

const BEST_SELLER_API = `${MANAGER_URL}/statistics/sales-quantity/bestseller`;
const SALES_QUANTITY_API = `${ADMIN_URL}/statistics/sales-quantity`

export const GET_TOP_100_BEST_SELLERS = `${BEST_SELLER_API}`;
export const GET_WEEKLY_BEST_SELLERS = `${BEST_SELLER_API}/weekly`;
export const GET_MONTHLY_BEST_SELLERS = `${BEST_SELLER_API}/monthly`;
export const GET_YEARLY_BEST_SELLERS = `${BEST_SELLER_API}/yearly`;
export const GET_BEST_SELLERS_BY_CATEGORY = (categoryId: number) => `${BEST_SELLER_API}/category/${categoryId}`;
export const GET_DAILY_SALES_QUANTITY = `${SALES_QUANTITY_API}/daily`;
export const GET_WEEKLY_SALES_QUANTITY = `${SALES_QUANTITY_API}/weekly`;
export const GET_MONTHLY_SALES_QUANTITY = (year: number) => `${SALES_QUANTITY_API}/monthly?year=${year}`;
export const GET_SALES_QUANTITY_BY_CATEGORY = `${SALES_QUANTITY_API}/category`;
export const GET_SALES_QUANTITY_BY_BRANCH = (year: number, month: number) => {
  const queryParams = new URLSearchParams();
  queryParams.append("year", year.toString());
  queryParams.append("month", month.toString());
  return `${SALES_QUANTITY_API}/branch?${queryParams}`;
}
export const GET_SALES_QUANTITY_BY_DISCOUNT_POLICY = (year: number, quarter: number) => {
  const queryParams = new URLSearchParams();
  queryParams.append("year", year.toString());
  queryParams.append("quarter", quarter.toString());
  return `${SALES_QUANTITY_API}/discount-policy?${queryParams}`;
}