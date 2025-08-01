import { DisplayType } from "@/apis/enums/DisplayType";

export interface LocationResponseDto{
    locationId : number;
    bookTitle : string;
    floor: string;
    hall: string;
    section:string;
    type: DisplayType;
    note: string;
}