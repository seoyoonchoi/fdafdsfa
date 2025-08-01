package com.example.bookhub_back.service.publisher;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessage;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.publisher.request.PublisherRequestDto;
import com.example.bookhub_back.dto.publisher.response.PublisherResponseDto;
import com.example.bookhub_back.entity.Publisher;
import com.example.bookhub_back.repository.PublisherRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PublisherServiceImpl implements PublisherService {

    private final PublisherRepository publisherRepository;
    @Override
    public ResponseDto<Void> createPublisher(PublisherRequestDto dto) {

        Publisher newPublisher = Publisher.builder()
                .publisherName(dto.getPublisherName())
                .build();

        publisherRepository.save(newPublisher);

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);

    }

    @Override
    @Transactional
    public ResponseDto<Void> updatePublisher(Long publisherId, PublisherRequestDto dto) {
        PublisherResponseDto responseDto = null;
        Publisher publisher = publisherRepository.findById(publisherId)
                .orElseThrow(() -> new EntityNotFoundException(ResponseCode.NO_EXIST_ID + publisherId));

        publisher.setPublisherName(dto.getPublisherName());

        publisherRepository.save(publisher);

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);

    }

    @Override
    public ResponseDto<Void> deletePublisher(Long publisherId) {
        Publisher publisher = publisherRepository.findById(publisherId)
                .orElseThrow(() -> new EntityNotFoundException(ResponseCode.NO_EXIST_ID + publisherId));

        publisherRepository.deleteById(publisherId);
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);

    }

    @Override
    @Transactional(readOnly = true)
    public ResponseDto<PageResponseDto<PublisherResponseDto>> getPublisherByNameContaining(String keyword, int page, int size) {


        if(keyword == null || keyword.trim().isEmpty()) {
            return ResponseDto.fail(ResponseCode.REQUIRED_FIELD_MISSING,ResponseMessage.REQUIRED_FIELD_MISSING);
        }

        PageRequest pageable = PageRequest.of(page,size);

        Page<Publisher> result = publisherRepository.findByPublisherNameContaining(keyword, pageable);

        List<PublisherResponseDto> content = result.getContent().stream()
                .map(entity -> PublisherResponseDto.builder()
                        .publisherId(entity.getPublisherId())
                        .publisherName(entity.getPublisherName())
                        .build())
                .collect(Collectors.toList());
        PageResponseDto<PublisherResponseDto> pageDto = PageResponseDto.of(
                content,
                result.getTotalElements(),
                result.getTotalPages(),
                result.getNumber()
        );

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, pageDto);
    }

    @Override
    public ResponseDto<PageResponseDto<PublisherResponseDto>> getPublishers(int page, int size) {
        PageRequest pageable = PageRequest.of(page,size);
        Page<Publisher> result = publisherRepository.findAll(pageable);
        List<PublisherResponseDto> content = result.getContent().stream()
                .map(entity -> PublisherResponseDto.builder()
                        .publisherId(entity.getPublisherId())
                        .publisherName(entity.getPublisherName())
                        .build())
                .collect(Collectors.toList());
        PageResponseDto<PublisherResponseDto> pageDto = PageResponseDto.of(
                content,
                result.getTotalElements(),
                result.getTotalPages(),
                result.getNumber()
        );
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, pageDto);
    }

    @Override
    public ResponseDto<PublisherResponseDto> getPublisherById(Long publisherId) {
        Publisher publisher = publisherRepository.findById(publisherId)
                .orElseThrow(() -> new EntityNotFoundException(ResponseCode.NO_EXIST_ID + publisherId));

        PublisherResponseDto dto = null;
        dto = PublisherResponseDto.builder()
                .publisherId(publisherId)
                .publisherName(publisher.getPublisherName())
                .build();
        return ResponseDto.success(ResponseCode.SUCCESS,ResponseMessage.SUCCESS,dto);
    }
}
