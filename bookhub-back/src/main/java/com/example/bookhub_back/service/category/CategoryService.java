package com.example.bookhub_back.service.category;

import com.example.bookhub_back.common.enums.CategoryType;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.category.request.CategoryCreateRequestDto;
import com.example.bookhub_back.dto.category.request.CategoryUpdateRequestDto;
import com.example.bookhub_back.dto.category.response.CategoryCreateResponseDto;
import com.example.bookhub_back.dto.category.response.CategoryTreeResponseDto;
import com.example.bookhub_back.dto.category.response.CategoryUpdateResponseDto;

import java.util.List;

public interface CategoryService {
    ResponseDto<CategoryCreateResponseDto> createCategory(CategoryCreateRequestDto dto);
    ResponseDto<CategoryUpdateResponseDto> updateCategory(Long categoryId, CategoryUpdateRequestDto dto);
    ResponseDto<Void> deleteCategory(Long categoryId);
    ResponseDto<List<CategoryTreeResponseDto>> getCategoryTree(CategoryType type);
    ResponseDto<List<CategoryTreeResponseDto>> getAllActiveCategories();
    ResponseDto<List<CategoryTreeResponseDto>> getRootCategories();
    ResponseDto<List<CategoryTreeResponseDto>> getSubCategories(Long parentId);
    ResponseDto<?> getPolicyByCategoryId(Long categoryId);
}
