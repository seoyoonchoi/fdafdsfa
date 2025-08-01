package com.example.bookhub_back.dto.policy.response;

import com.example.bookhub_back.common.enums.PolicyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PolicyDetailResponseDto {
    private String policyTitle;
    private String policyDescription;
    private PolicyType policyType;
    private Long totalPriceAchieve;
    private Long discountPercent;
    private LocalDate startDate;
    private LocalDate endDate;
}
