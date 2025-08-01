package com.example.bookhub_back.dto.location.request;

import com.example.bookhub_back.common.enums.DisplayType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@AllArgsConstructor
@Builder
@Setter
public class LocationUpdateRequestDto {
    private String floor;
    private String hall;
    private String section;
    private DisplayType displayType;
    private String note;
}
