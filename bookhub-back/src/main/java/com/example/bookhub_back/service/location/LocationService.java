package com.example.bookhub_back.service.location;

import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.location.request.LocationCreateRequestDto;
import com.example.bookhub_back.dto.location.request.LocationUpdateRequestDto;
import com.example.bookhub_back.dto.location.response.LocationResponseDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

public interface LocationService {
    ResponseDto<Void> createLocation(Long branchId, LocationCreateRequestDto dto);

    ResponseDto<Void> updateLocation(Long branchId, Long locationId, @Valid LocationUpdateRequestDto dto);

    ResponseDto<Void> deleteLocation(Long branchId, Long locationId);

    ResponseDto<PageResponseDto<LocationResponseDto>> getFilteredLocations(@Min(0) int page, @Min(1) int size, String keyword, Long branchId);

    ResponseDto<LocationResponseDto> getLocation(Long locationId);
}
