package com.example.bookhub_back.dto.publisher.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class PublisherResponseDto {
    private Long publisherId;
    private String publisherName;

}
