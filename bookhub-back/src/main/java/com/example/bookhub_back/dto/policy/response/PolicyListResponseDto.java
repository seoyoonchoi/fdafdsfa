package com.example.bookhub_back.dto.policy.response;

import com.example.bookhub_back.common.enums.PolicyType;
import lombok.Builder;
import lombok.Getter;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDate;

@Getter
@Builder
public class PolicyListResponseDto {
    private Long policyId;
    private String policyTitle;
    private PolicyType policyType;
    private LocalDate startDate;
    private LocalDate endDate;
}
