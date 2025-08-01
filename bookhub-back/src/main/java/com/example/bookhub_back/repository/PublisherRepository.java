package com.example.bookhub_back.repository;

import com.example.bookhub_back.entity.Publisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublisherRepository extends JpaRepository<Publisher,Long> {
    Page<Publisher> findByPublisherNameContaining(String keyword, Pageable pageable);
}
