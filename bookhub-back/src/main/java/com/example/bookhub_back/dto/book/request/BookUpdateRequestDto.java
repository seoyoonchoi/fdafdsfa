package com.example.bookhub_back.dto.book.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookUpdateRequestDto {
    private String isbn;
    private Long bookPrice;
    private Long categoryId;
    private String coverUrl;
    private String description;
    private String bookStatus;
    private Long policyId;
}
