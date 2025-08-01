package com.example.bookhub_back.controller.category;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.common.enums.CategoryType;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.category.request.CategoryCreateRequestDto;
import com.example.bookhub_back.dto.category.request.CategoryUpdateRequestDto;
import com.example.bookhub_back.dto.category.response.CategoryCreateResponseDto;
import com.example.bookhub_back.dto.category.response.CategoryTreeResponseDto;
import com.example.bookhub_back.dto.category.response.CategoryUpdateResponseDto;
import com.example.bookhub_back.service.category.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping(ApiMappingPattern.ADMIN_API+"/categories")
    public ResponseEntity<ResponseDto<CategoryCreateResponseDto>> createCategory(
            @Valid @RequestBody CategoryCreateRequestDto dto) {
        ResponseDto<CategoryCreateResponseDto> category = categoryService.createCategory(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(category);
    }

    @PutMapping(ApiMappingPattern.ADMIN_API+"/categories/{categoryId}")
    public ResponseDto<CategoryUpdateResponseDto> updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody CategoryUpdateRequestDto dto) {
        return categoryService.updateCategory(categoryId, dto);
    }

    @DeleteMapping(ApiMappingPattern.ADMIN_API + "/categories/{categoryId}")
    public ResponseDto<Void> deleteCategory(@PathVariable Long categoryId) {
        return categoryService.deleteCategory(categoryId);
    }

    @GetMapping(ApiMappingPattern.ADMIN_API + "/categories/tree")
    public ResponseDto<List<CategoryTreeResponseDto>> getCategoryTree(@RequestParam CategoryType type) {
        return categoryService.getCategoryTree(type);
    }

    @GetMapping(ApiMappingPattern.ADMIN_API + "/categories/active")
    public ResponseDto<List<CategoryTreeResponseDto>> getActiveCategories() {
        return categoryService.getAllActiveCategories();
    }

    @GetMapping(ApiMappingPattern.ADMIN_API + "/categories/roots")
    public ResponseDto<List<CategoryTreeResponseDto>> getRootCategories() {
        return categoryService.getRootCategories();
    }

    @GetMapping(ApiMappingPattern.ADMIN_API + "/categories/subcategories/{parentId}")
    public ResponseDto<List<CategoryTreeResponseDto>> getSubCategories(@PathVariable Long parentId) {
        return categoryService.getSubCategories(parentId);
    }

    @GetMapping(ApiMappingPattern.COMMON_API + "/categories/{categoryId}/policy")
    public ResponseDto<?> getPolicyByCategory(@PathVariable("categoryId") Long categoryId) {
        return categoryService.getPolicyByCategoryId(categoryId);
    }
}
