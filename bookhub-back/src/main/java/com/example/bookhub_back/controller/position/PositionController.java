package com.example.bookhub_back.controller.position;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.position.response.PositionListResponseDto;
import com.example.bookhub_back.service.position.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(ApiMappingPattern.AUTH_API + "/positions")
@RequiredArgsConstructor
public class PositionController {
    private final PositionService positionService;

    @GetMapping
    public ResponseEntity<ResponseDto<List<PositionListResponseDto>>> getAllPosition() {
        ResponseDto<List<PositionListResponseDto>> responseDto = positionService.getAllPosition();
        return ResponseDto.toResponseEntity(HttpStatus.OK, responseDto);
    }
}
