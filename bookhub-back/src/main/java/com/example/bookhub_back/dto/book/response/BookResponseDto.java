package com.example.bookhub_back.dto.book.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponseDto {
    private String isbn;
    private String bookTitle;
    private Long categoryId;
    private String categoryName;
    private String authorName;
    private String publisherName;
    private Long bookPrice;
    private LocalDateTime publishedDate;
    private String coverUrl;
    private String pageCount;
    private String language;
    private String description;
    private String bookStatus;
    private Long policyId;
}
