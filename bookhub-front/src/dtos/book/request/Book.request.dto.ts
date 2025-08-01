import { BookStatus } from "@/apis/enums/BookStatus";

export interface BookCreateRequestDto {
  isbn: string;
  categoryId: number;
  authorId: number;
  publisherId: number;
  bookTitle: string;
  bookPrice: number;
  publishedDate: string;
  coverUrl?: string;
  pageCount: string;
  language: string;
  description?: string;
  policyId?: number;
}

export interface BookUpdateRequestDto {
  isbn: string;
  bookPrice?: number;
  description?: string;
  bookStatus?: BookStatus;
  policyId?: number | null;
  categoryId?: number | null;
}