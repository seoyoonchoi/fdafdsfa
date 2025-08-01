package com.example.bookhub_back.service.employee;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessageKorean;
import com.example.bookhub_back.common.enums.AlertType;
import com.example.bookhub_back.common.enums.ChangeType;
import com.example.bookhub_back.common.enums.IsApproved;
import com.example.bookhub_back.common.enums.Status;
import com.example.bookhub_back.common.utils.DateUtils;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.alert.request.AlertCreateRequestDto;
import com.example.bookhub_back.dto.employee.request.EmployeeOrganizationUpdateRequestDto;
import com.example.bookhub_back.dto.employee.request.EmployeeSignUpApprovalRequestDto;
import com.example.bookhub_back.dto.employee.request.EmployeeStatusUpdateRequestDto;
import com.example.bookhub_back.dto.employee.response.EmployeeListResponseDto;
import com.example.bookhub_back.dto.employee.response.EmployeeResponseDto;
import com.example.bookhub_back.dto.employee.response.EmployeeSignUpApprovalResponseDto;
import com.example.bookhub_back.entity.Employee;
import com.example.bookhub_back.entity.EmployeeChangeLog;
import com.example.bookhub_back.entity.EmployeeExitLog;
import com.example.bookhub_back.entity.EmployeeSignUpApproval;
import com.example.bookhub_back.repository.*;
import com.example.bookhub_back.security.auth.EmployeePrincipal;
import com.example.bookhub_back.service.alert.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final EmployeeSignUpApprovalRepository employeeSignUpApprovalRepository;
    private final BranchRepository branchRepository;
    private final PositionRepository positionRepository;
    private final AuthorityRepository authorityRepository;
    private final AlertService alertService;
    private final EmployeeChangeLogRepository employeeChangeLogRepository;
    private final EmployeeExitLogRepository employeeExitLogRepository;

    @Override
    public ResponseDto<PageResponseDto<EmployeeListResponseDto>> searchEmployee(int page, int size, String name, Long branchId, Long positionId, Long authorityId, Status status) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Employee> employees = null;

        employees = employeeRepository.searchEmployee(name, branchId, positionId, authorityId, status, pageable);

        List<EmployeeListResponseDto> content = employees.stream()
            .map(employee -> EmployeeListResponseDto.builder()
                .employeeId(employee.getEmployeeId())
                .employeeNumber(employee.getEmployeeNumber())
                .employeeName(employee.getName())
                .branchName(employee.getBranchId().getBranchName())
                .positionName(employee.getPositionId().getPositionName())
                .authorityName(employee.getAuthorityId().getAuthorityName())
                .status(employee.getStatus())
                .build())
            .collect(Collectors.toList());

        PageResponseDto<EmployeeListResponseDto> responseDtos = PageResponseDto.of(
            content,
            employees.getTotalElements(),
            employees.getTotalPages(),
            employees.getNumber()
        );

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, responseDtos);
    }

    @Override
    public ResponseDto<EmployeeResponseDto> getEmployeeById(Long employeeId) {
        EmployeeResponseDto responseDto = null;
        Employee employee = null;

        employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new IllegalArgumentException("직원을 찾을 수 없습니다."));

        responseDto = EmployeeResponseDto.builder()
            .employeeId(employee.getEmployeeId())
            .employeeNumber(employee.getEmployeeNumber())
            .employeeName(employee.getName())
            .branchId(employee.getBranchId().getBranchId())
            .branchName(employee.getBranchId().getBranchName())
            .positionId(employee.getPositionId().getPositionId())
            .positionName(employee.getPositionId().getPositionName())
            .authorityId(employee.getAuthorityId().getAuthorityId())
            .authorityName(employee.getAuthorityId().getAuthorityName())
            .email(employee.getEmail())
            .phoneNumber(employee.getPhoneNumber())
            .birthDate(employee.getBirthDate())
            .status(employee.getStatus())
            .createdAt(DateUtils.format(employee.getCreatedAt()))
            .build();

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, responseDto);
    }

    @Override
    public ResponseDto<PageResponseDto<EmployeeSignUpApprovalResponseDto>> getPendingEmployee(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EmployeeSignUpApproval> employeeSignUpApprovals = null;
        List<EmployeeSignUpApprovalResponseDto> content = null;

        IsApproved isApproved = IsApproved.PENDING;

        employeeSignUpApprovals = employeeSignUpApprovalRepository.searchEmployee(isApproved, pageable);

        content = employeeSignUpApprovals.stream()
            .map(employeeSignUpApproval -> EmployeeSignUpApprovalResponseDto.builder()
                .approvalId(employeeSignUpApproval.getApprovalId())
                .employeeId(employeeSignUpApproval.getEmployeeId().getEmployeeId())
                .employeeNumber(employeeSignUpApproval.getEmployeeId().getEmployeeNumber())
                .employeeName(employeeSignUpApproval.getEmployeeId().getName())
                .branchName(employeeSignUpApproval.getEmployeeId().getBranchId().getBranchName())
                .email(employeeSignUpApproval.getEmployeeId().getEmail())
                .phoneNumber(employeeSignUpApproval.getEmployeeId().getPhoneNumber())
                .appliedAt(DateUtils.format(employeeSignUpApproval.getEmployeeId().getCreatedAt()))
                .isApproved(employeeSignUpApproval.getIsApproved())
                .build())
            .collect(Collectors.toList());

        PageResponseDto<EmployeeSignUpApprovalResponseDto> responseDtos = PageResponseDto.of(
            content,
            employeeSignUpApprovals.getTotalElements(),
            employeeSignUpApprovals.getTotalPages(),
            employeeSignUpApprovals.getNumber()
        );

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, responseDtos);
    }

    @Override
    @Transactional
    public ResponseDto<EmployeeSignUpApprovalResponseDto> updateApproval(Long employeeId, EmployeeSignUpApprovalRequestDto dto, EmployeePrincipal employeePrincipal) {
        EmployeeListResponseDto responseDto = null;
        EmployeeSignUpApproval employeeSignUpApproval = null;
        Employee employee = null;
        Employee authorizerEmployee = null;

        employee = employeeRepository.findById(employeeId)
            .filter(emp -> emp.getIsApproved() == IsApproved.PENDING)
            .orElseThrow(() -> new IllegalArgumentException("회원가입 승인 대기중인 직원이 아닙니다."));

        employeeSignUpApproval = employeeSignUpApprovalRepository.findByEmployeeIdAndIsApproved(employee, IsApproved.PENDING)
            .orElseThrow(() -> new IllegalArgumentException("회원가입 승인 대기중인 직원이 사원이 없습니다."));

        authorizerEmployee = employeeRepository.findByLoginId(employeePrincipal.getLoginId())
            .orElseThrow(() -> new IllegalArgumentException("관리자를 찾을 수 없습니다."));

        if (dto.getIsApproved().equals(IsApproved.APPROVED) && dto.getDeniedReason().isBlank()) {
            employee.setIsApproved(dto.getIsApproved());
            employeeSignUpApproval.setAuthorizerId(authorizerEmployee);
            employeeSignUpApproval.setIsApproved(dto.getIsApproved());
        } else if (dto.getIsApproved().equals(IsApproved.DENIED) && !dto.getDeniedReason().isBlank()) {
            employee.setIsApproved(dto.getIsApproved());
            employeeSignUpApproval.setAuthorizerId(authorizerEmployee);
            employeeSignUpApproval.setIsApproved(dto.getIsApproved());
            employeeSignUpApproval.setDeniedReason(dto.getDeniedReason());
        } else {
            throw new IllegalArgumentException();
        }

        employeeRepository.save(employee);
        employeeSignUpApprovalRepository.save(employeeSignUpApproval);

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS);
    }

    @Override
    @Transactional
    public ResponseDto<Void> updateOrganization(Long employeeId, EmployeeOrganizationUpdateRequestDto dto, EmployeePrincipal employeePrincipal) {
        Employee employee = null;
        Employee authorizer = null;

        employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new IllegalArgumentException("직원 정보를 찾을 수 없습니다."));

        authorizer = employeeRepository.findByLoginId(employeePrincipal.getLoginId())
            .orElseThrow(() -> new IllegalArgumentException("직원 정보를 찾을 수 없습니다."));

        Long preBranchId = employee.getBranchId().getBranchId();
        Long prePositionId = employee.getPositionId().getPositionId();
        Long preAuthorityId = employee.getAuthorityId().getAuthorityId();

        if ((dto.getBranchId() == 0 || dto.getBranchId().equals(preBranchId))
            && (dto.getPositionId() == 0 || dto.getPositionId().equals(prePositionId))
            && (dto.getAuthorityId() == 0 || dto.getAuthorityId().equals(preAuthorityId))) {
            return ResponseDto.fail(ResponseCode.INVALID_INPUT, "변경된 정보가 없습니다.");
        }

        if (dto.getBranchId() != 0 && !dto.getBranchId().equals(preBranchId)) {
            employee.setBranchId(branchRepository.findById(dto.getBranchId())
                .orElseThrow(() -> new IllegalArgumentException("지점 정보가 정확하지 않습니다.")));

            EmployeeChangeLog employeeChangeLog = EmployeeChangeLog.builder()
                .employeeId(employee)
                .authorizerId(authorizer)
                .changeType(ChangeType.BRANCH_CHANGE)
                .previousBranchId(branchRepository.findById(preBranchId)
                    .orElseThrow(() -> new IllegalArgumentException("지점 정보가 정확하지 않습니다.")))
                .build();

            employeeChangeLogRepository.save(employeeChangeLog);

            alertService.createAlert(AlertCreateRequestDto.builder()
                .employeeId(employee.getEmployeeId())
                .alertType(String.valueOf(AlertType.CHANGE_BRANCH_SUCCESS))
                .alertTargetTable("EMPLOYEES")
                .targetPk(employee.getEmployeeId())
                .message("지점이 [" + employee.getBranchId().getBranchName() + "]로 변경되었습니다.")
                .build()
            );
        }

        if (dto.getPositionId() != 0 && !dto.getPositionId().equals(prePositionId)) {
            employee.setPositionId(positionRepository.findById(dto.getPositionId())
                .orElseThrow(() -> new IllegalArgumentException("직급 정보가 정확하지 않습니다.")));

            EmployeeChangeLog employeeChangeLog = EmployeeChangeLog.builder()
                .employeeId(employee)
                .authorizerId(authorizer)
                .changeType(ChangeType.POSITION_CHANGE)
                .previousPositionId(positionRepository.findById(prePositionId)
                    .orElseThrow(() -> new IllegalArgumentException("직급 정보가 정확하지 않습니다.")))
                .build();

            employeeChangeLogRepository.save(employeeChangeLog);

            alertService.createAlert(AlertCreateRequestDto.builder()
                .employeeId(employee.getEmployeeId())
                .alertType(String.valueOf(AlertType.CHANGE_POSITION_SUCCESS))
                .alertTargetTable("EMPLOYEES")
                .targetPk(employee.getEmployeeId())
                .message("직급이 [" + employee.getPositionId().getPositionName() + "]로 변경되었습니다.")
                .build()
            );
        }

        if (dto.getAuthorityId() != 0 && !dto.getAuthorityId().equals(preAuthorityId)) {
            employee.setAuthorityId(authorityRepository.findById(dto.getAuthorityId())
                .orElseThrow(() -> new IllegalArgumentException("권한 정보가 정확하지 않습니다.")));

            EmployeeChangeLog employeeChangeLog = EmployeeChangeLog.builder()
                .employeeId(employee)
                .authorizerId(authorizer)
                .changeType(ChangeType.AUTHORITY_CHANGE)
                .previousAuthorityId(authorityRepository.findById(preAuthorityId)
                    .orElseThrow(() -> new IllegalArgumentException("권한 정보가 정확하지 않습니다.")))
                .build();

            employeeChangeLogRepository.save(employeeChangeLog);

            alertService.createAlert(AlertCreateRequestDto.builder()
                .employeeId(employee.getEmployeeId())
                .alertType(String.valueOf(AlertType.CHANGE_PERMISSION_SUCCESS))
                .alertTargetTable("EMPLOYEES")
                .targetPk(employee.getEmployeeId())
                .message("권한이 [" + employee.getAuthorityId().getAuthorityName() + "]로 변경되었습니다.")
                .build()
            );
        }

        employeeRepository.save(employee);

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS);
    }

    @Override
    @Transactional
    public ResponseDto<Void> updateStatus(Long employeeId, EmployeeStatusUpdateRequestDto dto, EmployeePrincipal employeePrincipal) {
        Employee employee = null;
        Employee authorizer = null;

        employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new IllegalArgumentException("사원이 존재하지 않습니다."));

        authorizer = employeeRepository.findByLoginId(employeePrincipal.getLoginId())
            .orElseThrow(() -> new IllegalArgumentException("관리자가 존재하지 않습니다."));

        Status status = employee.getStatus();

        if (status == Status.EXITED) {
            throw new IllegalArgumentException("이미 퇴사 처리되었습니다.");
        }

        if (status != null && !status.equals(dto.getStatus())) {
            employee.setStatus(dto.getStatus());
            EmployeeExitLog employeeExitLog = EmployeeExitLog.builder()
                .employeeId(employee)
                .appliedAt(employee.getCreatedAt())
                .authorizerId(authorizer)
                .exitReason(dto.getExitReason())
                .build();
            employeeExitLogRepository.save(employeeExitLog);
        }

        employeeRepository.save(employee);

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS);
    }
}
