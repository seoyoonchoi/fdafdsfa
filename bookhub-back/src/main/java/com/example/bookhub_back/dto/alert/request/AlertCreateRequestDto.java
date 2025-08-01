package com.example.bookhub_back.dto.alert.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertCreateRequestDto {
    private Long employeeId;
    private String alertType;
    private String message;
    private String alertTargetTable;
    private Long targetPk;
    private String targetIsbn;
}
