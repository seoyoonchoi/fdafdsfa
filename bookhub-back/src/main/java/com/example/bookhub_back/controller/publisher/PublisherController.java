package com.example.bookhub_back.controller.publisher;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.publisher.request.PublisherRequestDto;
import com.example.bookhub_back.dto.publisher.response.PublisherResponseDto;
import com.example.bookhub_back.service.publisher.PublisherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiMappingPattern.ADMIN_API+"/publishers")
@RequiredArgsConstructor
public class PublisherController {
    private final PublisherService publisherService;

    @PostMapping
    public ResponseEntity<ResponseDto<Void>> createPublisher(
            @Valid @RequestBody PublisherRequestDto dto){
        ResponseDto<Void> publisher = publisherService.createPublisher(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(publisher);
    }

    @PutMapping("/{publisherId}")
    public ResponseEntity<ResponseDto<Void>> updatePublisher(
            @PathVariable Long publisherId,
            @Valid @RequestBody PublisherRequestDto dto){
        ResponseDto<Void> publisher = publisherService.updatePublisher(publisherId, dto);
        return ResponseEntity.status(HttpStatus.OK).body(publisher);
    }

    @DeleteMapping("/{publisherId}")
    public ResponseEntity<ResponseDto<Void>> deletePublisher(@PathVariable Long publisherId){
        ResponseDto<Void> responseDto = publisherService.deletePublisher(publisherId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping
    public ResponseEntity<ResponseDto<?>> getPublishers(
            @RequestParam (defaultValue = "0") int page,
            @RequestParam (defaultValue = "20") int size,
            @RequestParam (required = false) String keyword
    ){
        if(keyword != null && !keyword.isEmpty()){
            ResponseDto<PageResponseDto<PublisherResponseDto>> responseDto = publisherService.getPublisherByNameContaining(keyword, page, size);
            return ResponseEntity.status(HttpStatus.OK).body(responseDto);
        }ResponseDto<PageResponseDto<PublisherResponseDto>> publishers = publisherService.getPublishers(page,size);
        return ResponseEntity.status(HttpStatus.OK).body(publishers);
    }

    @GetMapping("/{publisherId}")
    public ResponseEntity<ResponseDto<PublisherResponseDto>> getPublisherById(
            @PathVariable Long publisherId
    ){
        ResponseDto<PublisherResponseDto> publisher = publisherService.getPublisherById(publisherId);
        return ResponseEntity.status(HttpStatus.OK).body(publisher);

    }


}
