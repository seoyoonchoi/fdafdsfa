package com.example.bookhub_back.repository;

import com.example.bookhub_back.entity.Author;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AuthorRepository extends JpaRepository<Author, Long> {
    @Query("SELECT a FROM Author a WHERE (:authorName IS NULL OR a.authorName LIKE CONCAT('%', :authorName, '%'))")
    Optional<Page<Author>> searchAuthor(@Param("authorName") String authorName, Pageable pageable);

    boolean existsByAuthorEmail(String authorEmail);
}
