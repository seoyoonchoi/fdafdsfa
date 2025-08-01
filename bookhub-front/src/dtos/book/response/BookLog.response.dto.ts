import { BookLogType } from "@/apis/enums/BookLogType";

export interface BookLogResponseDto {
  bookLogId: number;
  bookIsbn: string;
  bookTitle: string;
  bookLogType: BookLogType;
  previousPrice?: number;
  previousDiscountRate?: number;
  employeeName: string;
  policyId?: number;
  changedAt: Date;
}