package com.example.bookhub_back.service.authority;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessageKorean;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.authority.response.AuthorityListResponseDto;
import com.example.bookhub_back.entity.Authority;
import com.example.bookhub_back.repository.AuthorityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthorityServiceImpl implements AuthorityService {
    private final AuthorityRepository authorityRepository;

    @Override
    public ResponseDto<List<AuthorityListResponseDto>> getAllAuthorities() {
        List<AuthorityListResponseDto> responseDtos = null;
        List<Authority> authorities = null;

        authorities = authorityRepository.findAll();

        responseDtos = authorities.stream()
            .map(authority -> AuthorityListResponseDto.builder()
                .authorityId(authority.getAuthorityId())
                .authorityName(authority.getAuthorityName())
                .build())
            .collect(Collectors.toList());

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, responseDtos);
    }
}
