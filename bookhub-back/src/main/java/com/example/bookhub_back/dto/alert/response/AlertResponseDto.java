package com.example.bookhub_back.dto.alert.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertResponseDto {
    private Long alertId;
    private String alertType;
    private String message;
    private String alertTargetTable;
    private Long targetPk;
    private String targetIsbn;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
