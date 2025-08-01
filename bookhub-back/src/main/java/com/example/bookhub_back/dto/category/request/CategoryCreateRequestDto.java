package com.example.bookhub_back.dto.category.request;

import com.example.bookhub_back.common.enums.CategoryType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CategoryCreateRequestDto {
    @NotBlank(message = "카테고리 이름은 필수입니다.")
    private String categoryName;

    @NotNull(message = "카테고리 레벨은 필수입니다.")
    @Min(value = 1, message = "카테고리 레벨은 최소 1 이상이어야 합니다.")
    private Integer categoryLevel;

    @NotNull(message = "카테고리 타입은 필수입니다.")
    private CategoryType categoryType;

    private Integer categoryOrder;

    private Long parentCategoryId;
    private Long discountPolicyId;
}
