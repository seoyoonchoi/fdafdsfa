package com.example.bookhub_back.service.location;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessage;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.location.request.LocationCreateRequestDto;
import com.example.bookhub_back.dto.location.request.LocationUpdateRequestDto;
import com.example.bookhub_back.dto.location.response.LocationResponseDto;
import com.example.bookhub_back.entity.Book;
import com.example.bookhub_back.entity.Branch;
import com.example.bookhub_back.entity.Location;
import com.example.bookhub_back.repository.BookRepository;
import com.example.bookhub_back.repository.BranchRepository;
import com.example.bookhub_back.repository.LocationRepository;
import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final BranchRepository branchRepository;
    private final BookRepository bookRepository;
    private final LocationRepository locationRepository;

    @Override
    public ResponseDto<Void> createLocation(Long branchId, LocationCreateRequestDto dto) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new EntityNotFoundException(ResponseCode.NO_EXIST_ID));

        Book book = bookRepository.findByIsbn(dto.getBookIsbn())
                .orElseThrow(() -> new EntityNotFoundException(ResponseCode.NO_EXIST_ID));

        Location newLocation = Location.builder()
                .branch(branch)
                .book(book)
                .floor(dto.getFloor())
                .hall(dto.getHall())
                .section(dto.getSection())
                .displayType(dto.getDisplayType())
                .note(dto.getNote())
                .build();

        Location saved = locationRepository.save(newLocation);

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    @Override
    public ResponseDto<Void> updateLocation(Long branchId, Long locationId, LocationUpdateRequestDto dto) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new EntityNotFoundException(ResponseCode.NO_EXIST_ID));

        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new EntityNotFoundException(ResponseCode.NO_EXIST_ID));

        if(dto.getFloor() != null) location.setFloor(dto.getFloor());
        if(dto.getHall() != null) location.setHall(dto.getHall());
        if(dto.getSection() != null) location.setSection(dto.getSection());
        if(dto.getDisplayType() != null) location.setDisplayType(dto.getDisplayType());
        if(dto.getNote() != null) location.setNote(dto.getNote());

        Location updatedLocation = locationRepository.save(location);
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    @Override
    public ResponseDto<Void> deleteLocation(Long branchId, Long locationId) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new EntityNotFoundException(ResponseCode.NO_EXIST_ID));

        locationRepository.deleteById(locationId);
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseDto<PageResponseDto<LocationResponseDto>> getFilteredLocations(
            int page, int size, String keyword, Long branchId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Location> results = locationRepository.findFiltered(
                keyword != null && keyword.isBlank() ? null : keyword,
                branchId != null && branchId==0 ? null : branchId,
                pageable
        );

        List<LocationResponseDto> content = results.getContent().stream()
                .map(p -> LocationResponseDto.builder()
                        .locationId(p.getLocationId())
                        .bookTitle(p.getBook().getBookTitle())
                        .floor(p.getFloor())
                        .hall(p.getHall())
                        .section(p.getSection())
                        .type(p.getDisplayType())
                        .note(p.getNote())
                        .build()
                ).collect(Collectors.toList());

        PageResponseDto<LocationResponseDto> pageDto = PageResponseDto.of(
                content,
                results.getTotalElements(),
                results.getTotalPages(),
                results.getNumber()
        );
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, pageDto);


    }

    @Override
    @Transactional(readOnly = true)
    public ResponseDto<LocationResponseDto> getLocation(Long locationId) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new EntityNotFoundException(ResponseCode.NO_EXIST_ID));

        LocationResponseDto responseDto = LocationResponseDto.builder()
                .locationId(location.getLocationId())
                .bookTitle(location.getBook().getBookTitle())
                .floor(location.getFloor())
                .hall(location.getHall())
                .section(location.getSection())
                .type(location.getDisplayType())
                .note(location.getNote())
                .build();

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto);
    }
}
