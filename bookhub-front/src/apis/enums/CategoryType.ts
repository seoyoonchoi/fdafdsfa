export const CategoryType = {
    DOMESTIC: "DOMESTIC",
    FOREIGN: "FOREIGN"
}as const;

export type CategoryType = typeof CategoryType[keyof typeof CategoryType];