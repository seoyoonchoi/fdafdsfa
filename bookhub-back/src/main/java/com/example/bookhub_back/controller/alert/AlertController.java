package com.example.bookhub_back.controller.alert;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.alert.request.AlertCreateRequestDto;
import com.example.bookhub_back.dto.alert.request.AlertReadRequestDto;
import com.example.bookhub_back.dto.alert.response.AlertResponseDto;
import com.example.bookhub_back.security.auth.EmployeePrincipal;
import com.example.bookhub_back.service.alert.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiMappingPattern.COMMON_API+"/alerts")
@RequiredArgsConstructor
public class AlertController {
    private final AlertService alertService;

    @PostMapping
    public ResponseEntity<ResponseDto<AlertResponseDto>> createAlert(@RequestBody AlertCreateRequestDto dto) {
        ResponseDto<AlertResponseDto> responseDto = alertService.createAlert(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping("/all/{employeeId}")
    public ResponseEntity<ResponseDto<List<AlertResponseDto>>> getAllAlert(
            @AuthenticationPrincipal EmployeePrincipal employeePrincipal
    ) {
        Long employeeId = employeePrincipal.getEmployeeId();
        ResponseDto<List<AlertResponseDto>> responseDto = alertService.getAllAlerts(employeeId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping("/unread/{employeeId}")
    public ResponseEntity<ResponseDto<PageResponseDto<AlertResponseDto>>> getUnreadAlert(
            @AuthenticationPrincipal EmployeePrincipal employeePrincipal,
            @RequestParam int page,
            @RequestParam int size
    ) {
        Long employeeId = employeePrincipal.getEmployeeId();
        ResponseDto<PageResponseDto<AlertResponseDto>> responseDto = alertService.getUnreadAlerts(employeeId, page, size);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @PutMapping("/read")
    public ResponseEntity<ResponseDto<Void>> readAlert(@RequestBody AlertReadRequestDto dto) {
        ResponseDto<Void> responseDto = alertService.readAlert(dto);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }
}
