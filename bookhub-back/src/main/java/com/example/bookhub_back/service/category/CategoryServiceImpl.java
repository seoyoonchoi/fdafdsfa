package com.example.bookhub_back.service.category;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessage;
import com.example.bookhub_back.common.enums.CategoryType;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.category.request.CategoryCreateRequestDto;
import com.example.bookhub_back.dto.category.request.CategoryUpdateRequestDto;
import com.example.bookhub_back.dto.category.response.CategoryCreateResponseDto;
import com.example.bookhub_back.dto.category.response.CategoryTreeResponseDto;
import com.example.bookhub_back.dto.category.response.CategoryUpdateResponseDto;
import com.example.bookhub_back.dto.policy.response.PolicyDetailResponseDto;
import com.example.bookhub_back.entity.Category;
import com.example.bookhub_back.entity.Policy;
import com.example.bookhub_back.repository.CategoryRepository;
import com.example.bookhub_back.repository.PolicyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final PolicyRepository policyRepository;

    @Override
    @Transactional
    public ResponseDto<CategoryCreateResponseDto> createCategory(CategoryCreateRequestDto dto) {
        Category parent = null;
        CategoryCreateResponseDto responseDto;

        if (dto.getParentCategoryId() != null) {
            parent = categoryRepository.findById(dto.getParentCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("상위 카테고리가 존재하지 않습니다."));
        }

        Category newCategory = Category.builder()
                .categoryName(dto.getCategoryName())
                .categoryLevel(dto.getCategoryLevel())
                .categoryType(dto.getCategoryType())
                .isActive(true)
                .parentCategoryId(parent)
                .build();

        Category saved = categoryRepository.save(newCategory);

        responseDto = CategoryCreateResponseDto.builder()
                .categoryId(saved.getCategoryId())
                .categoryName(saved.getCategoryName())
                .categoryLevel(saved.getCategoryLevel())
                .categoryType(saved.getCategoryType())
                .categoryOrder(saved.getCategoryOrder())
                .build();

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto);
    }

    @Override
    @Transactional
    public ResponseDto<CategoryUpdateResponseDto> updateCategory(Long categoryId, CategoryUpdateRequestDto dto) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(()-> new IllegalArgumentException("카테고리가 존재하지 않습니다."));

        if (dto.getParentCategoryId() != null) {
            Category parent = categoryRepository.findById(dto.getParentCategoryId().getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("상위 카테고리가 존재하지 않습니다."));
            category.setParentCategoryId(parent);
        }
        if (dto.getCategoryName() != null) category.setCategoryName(dto.getCategoryName());
        if (dto.getCategoryLevel() != 0) category.setCategoryLevel(dto.getCategoryLevel());
        if (dto.getCategoryType() != null) category.setCategoryType(dto.getCategoryType());
        if (dto.getIsActive() != null) category.setIsActive(dto.getIsActive());
        Long policyId = dto.getDiscountPolicyId();

        if (policyId != null && policyId > 0) {
            Policy policy = policyRepository.findById(policyId)
                    .orElseThrow(() -> new IllegalArgumentException("할인 정책이 존재하지 않습니다."));
            category.setPolicyId(policy);
        } else {
            category.setPolicyId(null);
        }

        Category updated = categoryRepository.save(category);

        CategoryUpdateResponseDto responseDto = CategoryUpdateResponseDto.builder()
                .parentCategoryId(updated.getParentCategoryId() != null ? category.getParentCategoryId().getCategoryId() : null)
                .categoryName(updated.getCategoryName())
                .categoryLevel(updated.getCategoryLevel())
                .categoryType(updated.getCategoryType().toString())
                .isActive(updated.getIsActive())
                .discountPolicyId(updated.getPolicyId() != null ? category.getPolicyId().getPolicyId() : null)
                .build();

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto);
    }

    @Override
    @Transactional
    public ResponseDto<Void> deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리가 존재하지 않습니다."));
        category.setIsActive(false);
        categoryRepository.save(category);
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    @Override
    public ResponseDto<List<CategoryTreeResponseDto>> getCategoryTree(CategoryType type) {
        List<Category> rootCategories = categoryRepository.findByTypeAndLevel(type, 1);
        List<CategoryTreeResponseDto> result = rootCategories.stream()
                .map(this::buildTree)
                .collect(Collectors.toList());
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, result);
    }

    @Override
    public ResponseDto<List<CategoryTreeResponseDto>> getAllActiveCategories() {
        List<CategoryTreeResponseDto> result = categoryRepository.findActive().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, result);
    }

    @Override
    public ResponseDto<List<CategoryTreeResponseDto>> getRootCategories() {
        List<CategoryTreeResponseDto> result = categoryRepository.findRootCategories().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, result);
    }

    @Override
    public ResponseDto<List<CategoryTreeResponseDto>> getSubCategories(Long parentId) {
        List<CategoryTreeResponseDto> result = categoryRepository.findByParentId(parentId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, result);
    }

    @Override
    public ResponseDto<?> getPolicyByCategoryId(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));
        Policy policy = category.getPolicyId();

        if (policy != null) {
            return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, null);
        }

        PolicyDetailResponseDto dto = PolicyDetailResponseDto.builder()
                .policyTitle(policy.getPolicyTitle())
                .policyDescription(policy.getPolicyDescription())
                .policyType(policy.getPolicyType())
                .totalPriceAchieve(policy.getTotalPriceAchieve())
                .discountPercent(policy.getDiscountPercent())
                .startDate(policy.getStartDate())
                .endDate(policy.getEndDate())
                .build();

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, dto);
    }

    private CategoryTreeResponseDto toDto(Category c) {
        return CategoryTreeResponseDto.builder()
                .categoryId(c.getCategoryId())
                .categoryName(c.getCategoryName())
                .categoryLevel(c.getCategoryLevel())
                .categoryType(c.getCategoryType())
                .categoryOrder(c.getCategoryOrder())
                .isActive(c.getIsActive())
                .parentCategoryId(
                        c.getParentCategoryId() != null
                                ? c.getParentCategoryId().getCategoryId()
                                :null
                )
                .discountPolicyId(
                        c.getPolicyId() != null
                                ? c.getPolicyId().getPolicyId()
                                :null
                )
                .subCategories(new ArrayList<>())
                .build();
    }

    private CategoryTreeResponseDto buildTree(Category parent) {
        CategoryTreeResponseDto dto = toDto(parent);
        List<Category> children = categoryRepository.findByParentId(parent.getCategoryId());
        if (!children.isEmpty()) {
            List<CategoryTreeResponseDto> childDtos = children.stream()
                    .map(this::buildTree)
                    .collect(Collectors.toList());
            dto.setSubCategories(childDtos);
        }
        return dto;
    }
}
