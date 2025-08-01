package com.example.bookhub_back.service.employee;

import com.example.bookhub_back.common.enums.Status;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.employee.request.EmployeeOrganizationUpdateRequestDto;
import com.example.bookhub_back.dto.employee.request.EmployeeSignUpApprovalRequestDto;
import com.example.bookhub_back.dto.employee.request.EmployeeStatusUpdateRequestDto;
import com.example.bookhub_back.dto.employee.response.EmployeeListResponseDto;
import com.example.bookhub_back.dto.employee.response.EmployeeResponseDto;
import com.example.bookhub_back.dto.employee.response.EmployeeSignUpApprovalResponseDto;
import com.example.bookhub_back.security.auth.EmployeePrincipal;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

import java.util.List;

public interface EmployeeService {
    ResponseDto<PageResponseDto<EmployeeListResponseDto>> searchEmployee(@Min(0) int page, @Min(1) int size, String name, Long branchId, Long positionId, Long authorityId, Status status);

    ResponseDto<EmployeeResponseDto> getEmployeeById(Long employeeId);

    ResponseDto<PageResponseDto<EmployeeSignUpApprovalResponseDto>> getPendingEmployee(@Min(0) int page, @Min(1) int size);

    ResponseDto<EmployeeSignUpApprovalResponseDto> updateApproval(Long employeeId, @Valid EmployeeSignUpApprovalRequestDto dto, EmployeePrincipal employeePrincipal);

    ResponseDto<Void> updateOrganization(Long employeeId, EmployeeOrganizationUpdateRequestDto dto, EmployeePrincipal employeePrincipal);

    ResponseDto<Void> updateStatus(Long employeeId, @Valid EmployeeStatusUpdateRequestDto dto, EmployeePrincipal employeePrincipal);
}
