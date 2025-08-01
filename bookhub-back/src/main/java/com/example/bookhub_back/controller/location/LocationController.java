package com.example.bookhub_back.controller.location;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.location.response.LocationResponseDto;
import com.example.bookhub_back.service.location.LocationService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiMappingPattern.COMMON_API+"/locations")
@RequiredArgsConstructor
public class LocationController {
    private final LocationService locationService;

    @GetMapping
    public ResponseEntity<ResponseDto<PageResponseDto<LocationResponseDto>>> getLocations(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long branchId) {
        ResponseDto<PageResponseDto<LocationResponseDto>> response = locationService.getFilteredLocations(page,size,keyword,branchId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{locationId}")
    public ResponseEntity<ResponseDto<LocationResponseDto>> getLocationById(
            @PathVariable Long locationId
    ){
        ResponseDto<LocationResponseDto> location = locationService.getLocation(locationId);
        return ResponseEntity.status(HttpStatus.OK).body(location);
    }
}
