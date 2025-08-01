package com.example.bookhub_back.dto.category.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryUpdateResponseDto {
    private Long parentCategoryId;
    private String categoryName;
    private int categoryLevel;
    private String categoryType;
    private int categoryOrder;
    private Boolean isActive;
    private Long discountPolicyId;
}
