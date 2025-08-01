package com.example.bookhub_back.dto.policy.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class PolicyUpdateRequestDto {
    private String policyDescription;
    private Long totalPriceAchieve;
    private Long discountPercent;
    private LocalDate startDate;
    private LocalDate endDate;
}
