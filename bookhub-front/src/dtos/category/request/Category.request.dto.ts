import { CategoryType } from "@/apis/enums/CategoryType";

export interface CategoryCreateRequestDto {
  categoryName: string;
  categoryType: CategoryType;
  categoryLevel: 1 | 2;
  categoryOrder?: number;
  parentCategoryId?: number;
}

export interface CategoryUpdateRequestDto {
  categoryName?: string;
  categoryType?: CategoryType;
  parentCategoryId?: number;
  categoryLevel?: number;
  discountPolicyId?: number;
  isActive?: boolean;
}