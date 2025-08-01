export const DisplayType = {
    BOOK_SHELF : "BOOK_SHELF",
    DISPLAY_TABLE : "DISPLAY_TABLE"
}as const;

export type DisplayType = typeof DisplayType[keyof typeof DisplayType];