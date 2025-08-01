package com.example.bookhub_back.controller.policy;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.common.enums.PolicyType;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.policy.response.PolicyDetailResponseDto;
import com.example.bookhub_back.dto.policy.response.PolicyListResponseDto;
import com.example.bookhub_back.repository.PolicyRepository;
import com.example.bookhub_back.service.policy.PolicyService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping(ApiMappingPattern.COMMON_API + "/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    @GetMapping
    public ResponseEntity<ResponseDto<PageResponseDto<PolicyListResponseDto>>> getPolicies(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) PolicyType policyType,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate start,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate end){
        ResponseDto<PageResponseDto<PolicyListResponseDto>> response = policyService.getFilteredPolicies(page,size,keyword,policyType,start,end);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{policyId}")
    public ResponseEntity<ResponseDto<PolicyDetailResponseDto>> getPolicyById(
            @PathVariable Long policyId){
        ResponseDto<PolicyDetailResponseDto> policy = policyService.getPolicyById(policyId);
        return ResponseEntity.status(HttpStatus.OK).body(policy);
    }


}
