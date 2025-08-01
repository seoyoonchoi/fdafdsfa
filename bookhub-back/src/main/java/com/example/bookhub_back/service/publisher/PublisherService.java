package com.example.bookhub_back.service.publisher;

import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.publisher.request.PublisherRequestDto;
import com.example.bookhub_back.dto.publisher.response.PublisherResponseDto;
import jakarta.validation.Valid;

import java.util.List;

public interface PublisherService {

    ResponseDto<Void> createPublisher(@Valid PublisherRequestDto dto);

    ResponseDto<Void> updatePublisher(Long publisherId, @Valid PublisherRequestDto dto);

    ResponseDto<Void> deletePublisher(Long publisherId);

    ResponseDto<PageResponseDto<PublisherResponseDto>> getPublisherByNameContaining(String keyword, int page, int size);

    ResponseDto<PageResponseDto<PublisherResponseDto>> getPublishers(int page, int size);

    ResponseDto<PublisherResponseDto> getPublisherById(Long publisherId);
}
