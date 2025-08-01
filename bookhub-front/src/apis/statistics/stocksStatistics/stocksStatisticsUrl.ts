import { ADMIN_URL } from "@/apis/constants/constants"

const STOCK_STATISTICS_BASE_URL = `${ADMIN_URL}/statistics/stocks`

export const STOCK_STATISTICS_ZERO_URL = `${STOCK_STATISTICS_BASE_URL}/zero`
//2)지점별 in out loss
export const STOCK_STATISTICS_BRANCH_URL = `${STOCK_STATISTICS_BASE_URL}/branch`
//3)해당 년의 입고량 추이
export const STOCK_STATISTICS_TIME_URL = `${STOCK_STATISTICS_BASE_URL}/time`
//4)카테고리별 파이차트
export const STOCK_STATISTICS_CATEGORY_URL = `${STOCK_STATISTICS_BASE_URL}/category`