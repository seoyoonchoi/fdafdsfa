package com.example.bookhub_back.service.alert;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessage;
import com.example.bookhub_back.common.enums.AlertTargetTable;
import com.example.bookhub_back.common.enums.AlertType;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.alert.request.AlertCreateRequestDto;
import com.example.bookhub_back.dto.alert.request.AlertReadRequestDto;
import com.example.bookhub_back.dto.alert.response.AlertResponseDto;
import com.example.bookhub_back.entity.Alert;
import com.example.bookhub_back.entity.Employee;
import com.example.bookhub_back.provider.JwtTokenProvider;
import com.example.bookhub_back.repository.AlertRepository;
import com.example.bookhub_back.repository.EmployeeRepository;
import com.example.bookhub_back.security.auth.EmployeePrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertServiceImpl implements AlertService {
    private final AlertRepository alertRepository;
    private final EmployeeRepository employeeRepository;
    private final JwtTokenProvider jwtProvider;

    @Override
    public ResponseDto<AlertResponseDto> createAlert(AlertCreateRequestDto dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException(ResponseCode.USER_NOT_FOUND));

        Alert alert = Alert.builder()
                .employeeId(employee)
                .alertType(AlertType.valueOf(dto.getAlertType()))
                .message(dto.getMessage())
                .alertTargetTable(AlertTargetTable.valueOf(dto.getAlertTargetTable()))
                .targetPk(dto.getTargetPk())
                .targetIsbn(dto.getTargetIsbn())
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        Alert newAlert = alertRepository.save(alert);

        AlertResponseDto responseDto = AlertResponseDto.builder()
                .alertId(newAlert.getAlertId())
                .alertType(newAlert.getAlertType().name())
                .message(newAlert.getMessage())
                .alertTargetTable(newAlert.getAlertTargetTable().name())
                .targetPk(newAlert.getTargetPk())
                .targetIsbn(newAlert.getTargetIsbn())
                .isRead(newAlert.getIsRead())
                .createdAt(newAlert.getCreatedAt())
                .build();
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, responseDto);
    }

    @Override
    public ResponseDto<List<AlertResponseDto>> getAllAlerts(Long employeeId) {

        List<Alert> alerts = alertRepository.findByEmployeeId_EmployeeIdOrderByCreatedAtDesc(employeeId);
        List<AlertResponseDto> result = alerts.stream()
                .map(alert -> AlertResponseDto.builder()
                        .alertId(alert.getAlertId())
                        .alertType(alert.getAlertType().name())
                        .message(alert.getMessage())
                        .alertTargetTable(alert.getAlertTargetTable().name())
                        .targetPk(alert.getTargetPk())
                        .targetIsbn(alert.getTargetIsbn())
                        .isRead(alert.getIsRead())
                        .createdAt(alert.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, result);
    }

    @Override
    public ResponseDto<PageResponseDto<AlertResponseDto>> getUnreadAlerts(Long employeeId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Alert> alertPage = alertRepository.findByEmployeeId_EmployeeIdAndIsReadFalseOrderByCreatedAtDesc(employeeId, pageable);
        List<AlertResponseDto> result = alertPage.getContent().stream()
                .map(alert -> AlertResponseDto.builder()
                        .alertId(alert.getAlertId())
                        .alertType(alert.getAlertType().name())
                        .message(alert.getMessage())
                        .alertTargetTable(alert.getAlertTargetTable().name())
                        .targetPk(alert.getTargetPk())
                        .targetIsbn(alert.getTargetIsbn())
                        .isRead(alert.getIsRead())
                        .createdAt(alert.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        PageResponseDto<AlertResponseDto> pageResponse = PageResponseDto.of(
                result,
                alertPage.getTotalElements(),
                alertPage.getTotalPages(),
                alertPage.getNumber()
        );
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, pageResponse);
    }

    @Override
    public ResponseDto<Void> readAlert(AlertReadRequestDto dto) {
        List<Alert> alerts = alertRepository.findAllById(dto.getAlertIds());
        alerts.forEach(alert -> alert.setIsRead(true));
        alertRepository.saveAll(alerts);
        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }
}
