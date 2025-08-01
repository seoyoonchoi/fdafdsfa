package com.example.bookhub_back.dto.statistics.response.salesQuantity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategorySalesQuantityDto {
    Long totalSales;
    String categoryType;
    Long categoryId;
    String categoryName;
}
