import { CategoryType } from "@/apis/enums/CategoryType";

export interface CategoryCreateResponseDto {
  categoryId: number;
  categoryName: string;
  categoryLevel: number;
  categoryType: CategoryType;
  categoryOrder: number;
}

export interface CategoryTreeResponseDto{
  categoryId: number;
  categoryName: string;
  categoryLevel: number;
  categoryType: CategoryType;
  parentCategoryId?: number;
  categoryOrder?: number;
  isActive: boolean;
  discountPolicyId?: number;
  subCategories?: CategoryTreeResponseDto[];
}

export interface CategoryUpdateResponseDto {
  categoryId: number;
  categoryName: string;
  categoryLevel: number;
  categoryType: CategoryType;
  parentCategory?: number;
  categoryOrder: number;
  isActive: boolean;
  discountPolicy?: number;
}