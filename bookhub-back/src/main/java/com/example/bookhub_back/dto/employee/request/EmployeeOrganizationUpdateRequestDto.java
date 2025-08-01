package com.example.bookhub_back.dto.employee.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeOrganizationUpdateRequestDto {
    private Long branchId;
    private Long positionId;
    private Long authorityId;
}
