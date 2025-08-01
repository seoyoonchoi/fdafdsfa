package com.example.bookhub_back.dto.publisher.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PublisherRequestDto {
    @NotNull(message = "publisherName is Mandatory")
    private String publisherName;
}
