package com.example.bookhub_back.service.position;

import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.position.response.PositionListResponseDto;

import java.util.List;

public interface PositionService {
    ResponseDto<List<PositionListResponseDto>> getAllPosition();
}
