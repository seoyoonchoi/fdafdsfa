package com.example.bookhub_back.service.reception;

import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.reception.request.ReceptionCreateRequestDto;
import com.example.bookhub_back.dto.reception.response.ReceptionCreateResponseDto;
import com.example.bookhub_back.dto.reception.response.ReceptionListResponseDto;

import java.util.List;

public interface ReceptionService {
    ResponseDto<ReceptionCreateResponseDto> createReception(ReceptionCreateRequestDto dto, Long branchId);
    ResponseDto<Void> approveReception(Long id, Long employeeId);
    ResponseDto<PageResponseDto<ReceptionListResponseDto>> getPendingList(String loginId, int page, int size);
    ResponseDto<PageResponseDto<ReceptionListResponseDto>> getManagerConfirmedList(String token, int page, int size, String startDate, String endDate);
    ResponseDto<PageResponseDto<ReceptionListResponseDto>> getAdminConfirmedList(String branchName, String token, int page, int size);
}
