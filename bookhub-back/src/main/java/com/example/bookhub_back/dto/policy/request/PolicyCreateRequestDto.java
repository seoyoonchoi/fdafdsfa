package com.example.bookhub_back.dto.policy.request;

import com.example.bookhub_back.common.enums.PolicyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class PolicyCreateRequestDto {
    @NotBlank
    private String policyTitle;
    private String policyDescription;
    @NotNull
    private PolicyType policyType;
    private Long totalPriceAchieve;
    @NotNull
    private Long discountPercent;
    private LocalDate startDate;
    private LocalDate endDate;
}
