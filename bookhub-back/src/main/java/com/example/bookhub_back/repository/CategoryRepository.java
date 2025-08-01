package com.example.bookhub_back.repository;

import com.example.bookhub_back.common.enums.CategoryType;
import com.example.bookhub_back.entity.Category;
import com.example.bookhub_back.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("SELECT c FROM Category c WHERE c.isActive = true")
    List<Category> findActive();

    @Query("SELECT c FROM Category c WHERE c.parentCategoryId IS NULL AND c.isActive = true")
    List<Category> findRootCategories();

    @Query("SELECT c FROM Category c WHERE c.parentCategoryId.categoryId = :parentId AND c.isActive = true")
    List<Category> findByParentId(@Param("parentId") Long parentId);

    @Query("SELECT c FROM Category c WHERE c.categoryType = :type AND c.categoryLevel = :level AND c.isActive = true")
    List<Category> findByTypeAndLevel(@Param("type") CategoryType type, @Param("level") int level);

    @Query("SELECT c FROM Category c WHERE c.categoryName = :name AND c.isActive = true")
    Optional<Category> findActiveByName(@Param("name") String categoryName);

    Optional<Category> findByCategoryName(String categoryName);

    @Query("""
    SELECT c.policyId FROM Category c
    WHERE c.categoryId = :categoryId AND c.isActive = true
""")
    Optional<Policy> findPolicyByCategoryId(@Param("categoryId") Long categoryId);
}
