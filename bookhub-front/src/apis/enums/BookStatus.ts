export const BookStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    HIDDEN: "HIDDEN"
}as const;

export type BookStatus = typeof BookStatus[keyof typeof BookStatus];