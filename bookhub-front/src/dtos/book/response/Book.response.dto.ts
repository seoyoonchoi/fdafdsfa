import { BookStatus } from "@/apis/enums/BookStatus";

export interface BookResponseDto {
  isbn: string;
  bookTitle: string;
  categoryId: number;
  categoryName: string;
  authorName: string;
  publisherName: string;
  bookPrice: number;
  publishedDate: Date;
  coverUrl?: string;
  pageCount: string;
  language: string;
  description?: string;
  bookStatus?: BookStatus;
  policyId: number;
}