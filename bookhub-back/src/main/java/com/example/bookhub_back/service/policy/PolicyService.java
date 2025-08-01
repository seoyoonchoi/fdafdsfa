package com.example.bookhub_back.service.policy;

import com.example.bookhub_back.common.enums.PolicyType;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.policy.request.PolicyCreateRequestDto;
import com.example.bookhub_back.dto.policy.request.PolicyUpdateRequestDto;
import com.example.bookhub_back.dto.policy.response.PolicyDetailResponseDto;
import com.example.bookhub_back.dto.policy.response.PolicyListResponseDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;

public interface PolicyService {
    ResponseDto<Void> createPolicy(@Valid PolicyCreateRequestDto dto);

    ResponseDto<Void> updatePolicy(Long policyId, @Valid PolicyUpdateRequestDto dto);

    ResponseDto<Void> deletePolicy(Long policyId);

    ResponseDto<PageResponseDto<PolicyListResponseDto>> getFilteredPolicies(@Min(0) int page, @Min(1) int size, String keyword, PolicyType policyType, LocalDate start, LocalDate end);

    ResponseDto<PolicyDetailResponseDto> getPolicyById(Long policyId);
}
