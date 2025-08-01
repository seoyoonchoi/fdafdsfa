export const BookLogType = {
    CREATE: "CREATE",
    PRICE_CHANGE: "PRICE_CHANGE",
    DISCOUNT_RATE: "DISCOUNT_RATE",
    STATUS_CHANGE: "STATUS_CHANGE",
    HIDDEN: "HIDDEN"
}as const;

export type BookLogType = typeof BookLogType[keyof typeof BookLogType];