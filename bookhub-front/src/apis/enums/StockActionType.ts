export const StockActionType = {
    IN : "IN",
    OUT : "OUT",
    LOSS : "LOSS"
}as const;

export type StockActionType = typeof StockActionType[keyof typeof StockActionType];