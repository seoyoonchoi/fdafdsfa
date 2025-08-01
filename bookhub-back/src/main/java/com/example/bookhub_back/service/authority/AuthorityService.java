package com.example.bookhub_back.service.authority;

import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.authority.response.AuthorityListResponseDto;

import java.util.List;

public interface AuthorityService {
    ResponseDto<List<AuthorityListResponseDto>> getAllAuthorities();
}
