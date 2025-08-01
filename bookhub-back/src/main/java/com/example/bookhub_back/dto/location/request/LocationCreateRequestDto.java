package com.example.bookhub_back.dto.location.request;

import com.example.bookhub_back.common.enums.DisplayType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class LocationCreateRequestDto {
    private String bookIsbn;
    private String floor;
    private String hall;
    private String section;
    private DisplayType displayType;
    private String note;
}
