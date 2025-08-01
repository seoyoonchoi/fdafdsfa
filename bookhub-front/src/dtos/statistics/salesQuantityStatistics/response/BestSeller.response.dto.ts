export interface BestSellerResponseDto {
  isbn: string;
  bookTitle: string;
  authorName: string;
  categoryName: string;
  publisherName: string;
  coverUrl?: string;
  totalSales: number;
}