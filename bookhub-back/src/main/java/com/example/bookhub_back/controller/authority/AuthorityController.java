package com.example.bookhub_back.controller.authority;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.authority.response.AuthorityListResponseDto;
import com.example.bookhub_back.service.authority.AuthorityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(ApiMappingPattern.AUTH_API + "/authorities")
@RequiredArgsConstructor
public class AuthorityController {
    private final AuthorityService authorityService;

    @GetMapping
    public ResponseEntity<ResponseDto<List<AuthorityListResponseDto>>> getAllAuthorities() {
        ResponseDto<List<AuthorityListResponseDto>> responseDto = authorityService.getAllAuthorities();
        return  ResponseDto.toResponseEntity(HttpStatus.OK, responseDto);
    }
}
