package com.example.bookhub_back.service.policy;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessage;
import com.example.bookhub_back.common.enums.AlertTargetTable;
import com.example.bookhub_back.common.enums.AlertType;
import com.example.bookhub_back.common.enums.PolicyType;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.alert.request.AlertCreateRequestDto;
import com.example.bookhub_back.dto.policy.request.PolicyCreateRequestDto;
import com.example.bookhub_back.dto.policy.request.PolicyUpdateRequestDto;
import com.example.bookhub_back.dto.policy.response.PolicyDetailResponseDto;
import com.example.bookhub_back.dto.policy.response.PolicyListResponseDto;
import com.example.bookhub_back.entity.Employee;
import com.example.bookhub_back.entity.Policy;
import com.example.bookhub_back.repository.AlertRepository;
import com.example.bookhub_back.repository.EmployeeRepository;
import com.example.bookhub_back.repository.PolicyRepository;
import com.example.bookhub_back.service.alert.AlertServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PolicyServiceImpl implements PolicyService{

    private final PolicyRepository policyRepository;
    private final EmployeeRepository employeeRepository;
    private final AlertServiceImpl alertService;

    @Override
    public ResponseDto<Void> createPolicy(PolicyCreateRequestDto dto) {
        if(dto.getPolicyType() == PolicyType.TOTAL_PRICE_DISCOUNT && dto.getTotalPriceAchieve() == null) {
            throw new IllegalArgumentException(ResponseCode.VALIDATION_FAIL);
        }

        if(dto.getPolicyType() != PolicyType.TOTAL_PRICE_DISCOUNT && dto.getTotalPriceAchieve() != null) {
            throw new IllegalArgumentException(ResponseCode.VALIDATION_FAIL);
        }

        Policy newPolicy = Policy.builder()
                .policyTitle(dto.getPolicyTitle())
                .policyDescription(dto.getPolicyDescription())
                .policyType(dto.getPolicyType())
                .totalPriceAchieve(dto.getTotalPriceAchieve())
                .discountPercent(dto.getDiscountPercent())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .build();

        Policy savedPolicy = policyRepository.save(newPolicy);

        for(Employee employee : employeeRepository.findAll()) {
            alertService.createAlert(AlertCreateRequestDto.builder()
                    .employeeId(employee.getEmployeeId())
                    .alertType(AlertType.NOTICE.toString())
                    .alertTargetTable(AlertTargetTable.POLICIES.toString())
                    .targetPk(savedPolicy.getPolicyId())
                    .message("새로운 할인정책이 생성되었습니다")
                    .build());
        }
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    @Override
    public ResponseDto<Void> updatePolicy(Long policyId, PolicyUpdateRequestDto dto) {
        Policy policy = policyRepository.findById(policyId).orElseThrow(() -> new EntityNotFoundException(ResponseCode.NO_EXIST_ID + policyId));

        if (dto.getPolicyDescription() != null) {
            policy.setPolicyDescription(dto.getPolicyDescription());
        }
        if (dto.getTotalPriceAchieve() != null) {
            if(policy.getPolicyType().equals(PolicyType.TOTAL_PRICE_DISCOUNT)) {
                policy.setTotalPriceAchieve(dto.getTotalPriceAchieve());
            }else{
                throw new IllegalArgumentException(ResponseCode.VALIDATION_FAIL);
            }
        }
        if(dto.getDiscountPercent() != null) {
            policy.setDiscountPercent(dto.getDiscountPercent());
        }
        if(dto.getStartDate() != null) {
            policy.setStartDate(dto.getStartDate());
        }
        if(dto.getEndDate() != null) {
            policy.setEndDate(dto.getEndDate());
        }

        Policy updatePolicy = policyRepository.save(policy);

        for(Employee employee : employeeRepository.findAll()) {
             alertService.createAlert(AlertCreateRequestDto.builder()
                    .employeeId(employee.getEmployeeId())
                    .alertType(AlertType.NOTICE.toString())
                    .alertTargetTable(AlertTargetTable.POLICIES.toString())
                    .targetPk(updatePolicy.getPolicyId())
                    .message("할인정책이 수정되었습니다.")
                    .build());
        }

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    @Override
    public ResponseDto<Void> deletePolicy(Long policyId) {
        Policy policy = policyRepository.findById(policyId).orElseThrow(() -> new EntityNotFoundException(ResponseCode.NO_EXIST_ID + policyId));

        policyRepository.delete(policy);

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    @Override
    public ResponseDto<PageResponseDto<PolicyListResponseDto>> getFilteredPolicies(int page, int size, String keyword, PolicyType policyType, LocalDate start, LocalDate end) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Policy> result = policyRepository.findFiltered(keyword != null && keyword.isBlank() ?
                null : keyword,policyType,start,end,pageable);

        List<PolicyListResponseDto> content = result.getContent().stream()
                .map(policy -> PolicyListResponseDto.builder()
                        .policyId(policy.getPolicyId())
                        .policyTitle(policy.getPolicyTitle())
                        .policyType(policy.getPolicyType())
                        .startDate(policy.getStartDate())
                        .endDate(policy.getEndDate())
                        .build()
                ).collect(Collectors.toList());

        PageResponseDto<PolicyListResponseDto> pageDto = PageResponseDto.of(content,
                result.getTotalElements(),
                result.getTotalPages(),
                result.getNumber());

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, pageDto);

    }

    @Override
    @Transactional(readOnly = true)
    public ResponseDto<PolicyDetailResponseDto> getPolicyById(Long policyId) {
        PolicyDetailResponseDto dto = null;
        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new EntityNotFoundException(ResponseCode.NO_EXIST_ID + policyId));

        dto = PolicyDetailResponseDto.builder()
                .policyTitle(policy.getPolicyTitle())
                .policyDescription(policy.getPolicyDescription())
                .policyType(policy.getPolicyType())
                .totalPriceAchieve(policy.getTotalPriceAchieve())
                .discountPercent(policy.getDiscountPercent())
                .startDate(policy.getStartDate())
                .endDate(policy.getEndDate())
                .build();

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, dto);
    }
}
