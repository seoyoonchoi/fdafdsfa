export const PolicyType = {
    BOOK_DISCOUNT: "BOOK_DISCOUNT",
    CATEGORY_DISCOUNT : "CATEGORY_DISCOUNT",
    TOTAL_PRICE_DISCOUNT : "TOTAL_PRICE_DISCOUNT"
}as const;

export type PolicyType = typeof PolicyType[keyof typeof PolicyType];