package com.example.bookhub_back.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class PageResponseDto<T> {
    private final List<T> content;
    private final long totalElements;
    private final int totalPages;
    private final int currentPage;

    public static <T> PageResponseDto<T> of(
            List<T> content, long totalElements, int totalPages, int currentPage){
        return PageResponseDto.<T>builder()
                .content(content)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .currentPage(currentPage)
                .build();
    }

}