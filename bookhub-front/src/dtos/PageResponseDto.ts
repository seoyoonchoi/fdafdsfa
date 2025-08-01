import { AuthorResponseDto } from "./author/response/Author.response.dto";

export interface PageResponseDto<T>{
    map(arg0: (a: AuthorResponseDto) => { label: string; value: number; }): unknown;
    content: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
}