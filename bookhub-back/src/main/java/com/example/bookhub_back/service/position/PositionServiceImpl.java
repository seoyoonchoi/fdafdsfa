package com.example.bookhub_back.service.position;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessageKorean;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.position.response.PositionListResponseDto;
import com.example.bookhub_back.entity.Position;
import com.example.bookhub_back.repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PositionServiceImpl implements PositionService {
    private final PositionRepository positionRepository;

    @Override
    public ResponseDto<List<PositionListResponseDto>> getAllPosition() {
        List<PositionListResponseDto> responseDtos = null;
        List<Position> positions = null;

        positions = positionRepository.findAll();

        responseDtos = positions.stream()
            .map(position -> PositionListResponseDto.builder()
                .positionId(position.getPositionId())
                .positionName(position.getPositionName())
                .build())
            .collect(Collectors.toList());

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, responseDtos);
    }
}
