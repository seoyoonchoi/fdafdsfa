package com.example.bookhub_back.repository;

import com.example.bookhub_back.entity.BookLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookLogRepository extends JpaRepository <BookLog, Long>{
    Page<BookLog> findByBookIsbn_Isbn(String isbn, Pageable pageable);
}
