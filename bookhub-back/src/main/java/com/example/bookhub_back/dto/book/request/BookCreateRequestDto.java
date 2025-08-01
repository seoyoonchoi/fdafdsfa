package com.example.bookhub_back.dto.book.request;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookCreateRequestDto {
    private String isbn;
    private Long categoryId;
    private Long authorId;
    private Long publisherId;
    private String bookTitle;
    private Long bookPrice;
    private LocalDateTime publishedDate;
    private String coverUrl;
    private String pageCount;
    private String language;
    private String description;
    private Long policyId;
}
