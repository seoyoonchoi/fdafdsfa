package com.example.bookhub_back.repository;

import com.example.bookhub_back.common.enums.FileTargetType;
import com.example.bookhub_back.entity.UploadFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UploadFileRepository extends JpaRepository<UploadFile, Long> {
    Optional<UploadFile> findFirstByTargetTypeAndTargetId(FileTargetType targetType, String targetId);
}
