package com.example.bookhub_back.dto.category.response;

import com.example.bookhub_back.common.enums.CategoryType;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CategoryTreeResponseDto {
    private Long categoryId;
    private String categoryName;
    private int categoryLevel;
    private CategoryType categoryType;
    private int categoryOrder;
    private Boolean isActive;
    private Long parentCategoryId;
    private Long discountPolicyId;
    private List<CategoryTreeResponseDto> subCategories;
}
