package com.example.bookhub_back.dto.statistics.response.salesQuantity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BestSellerDto {
    String isbn;
    String bookTitle;
    String authorName;
    String categoryName;
    String publisherName;
    String coverUrl;
    Long totalSales;
}
