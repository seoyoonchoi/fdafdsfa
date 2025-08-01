package com.example.bookhub_back.service.branch;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessageKorean;
import com.example.bookhub_back.common.utils.DateUtils;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.branch.request.BranchCreateRequestDto;
import com.example.bookhub_back.dto.branch.request.BranchUpdateRequestDto;
import com.example.bookhub_back.dto.branch.response.BranchResponseDto;
import com.example.bookhub_back.entity.Branch;
import com.example.bookhub_back.repository.BranchRepository;
import jakarta.persistence.EntityNotFoundException;
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
public class BranchServiceImpl implements BranchService {
    private final BranchRepository branchRepository;

    @Override
    @Transactional
    public ResponseDto<Void> createBranch(BranchCreateRequestDto dto) {
        Branch branch = null;

        if (branchRepository.existsByBranchName(dto.getBranchName())) {
            throw new IllegalArgumentException("이미 존재하는 지점입니다.");
        }

        branch = Branch.builder()
            .branchName(dto.getBranchName())
            .branchLocation(dto.getBranchLocation())
            .build();

        branchRepository.save(branch);

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS);
    }

    @Override
    public ResponseDto<List<BranchResponseDto>> getAllBranches() {
        List<BranchResponseDto> responseDtos = null;
        List<Branch> branches = null;

        branches = branchRepository.findAll();

        responseDtos = branches.stream()
            .map(branch -> BranchResponseDto.builder()
                .branchId(branch.getBranchId())
                .branchName(branch.getBranchName())
                .branchLocation(branch.getBranchLocation())
                .createdAt(DateUtils.format(branch.getCreatedAt()))
                .updatedAt(DateUtils.format(branch.getUpdatedAt()))
                .build())
            .collect(Collectors.toList());

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, responseDtos);
    }

    @Override
    public ResponseDto<PageResponseDto<BranchResponseDto>> getAllBranchesByLocation(int page, int size, String branchLocation) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Branch> branches = null;
        List<BranchResponseDto> content = null;

        branches = branchRepository.searchBranch(branchLocation, pageable);

        content = branches.getContent().stream()
            .map(branch -> BranchResponseDto.builder()
                .branchId(branch.getBranchId())
                .branchName(branch.getBranchName())
                .branchLocation(branch.getBranchLocation())
                .createdAt(DateUtils.format(branch.getCreatedAt()))
                .updatedAt(DateUtils.format(branch.getUpdatedAt()))
                .build())
            .collect(Collectors.toList());

        PageResponseDto<BranchResponseDto> pageResponseDto = PageResponseDto.of(
            content,
            branches.getTotalElements(),
            branches.getTotalPages(),
            branches.getNumber()
        );

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, pageResponseDto);
    }

    @Override
    public ResponseDto<BranchResponseDto> getBranchById(Long branchId) {
        BranchResponseDto responseDto = null;
        Branch branch = null;

        branch = branchRepository.findById(branchId)
            .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 지점 아이디입니다."));

        responseDto = BranchResponseDto.builder()
            .branchId(branch.getBranchId())
            .branchName(branch.getBranchName())
            .branchLocation(branch.getBranchLocation())
            .createdAt(DateUtils.format(branch.getCreatedAt()))
            .updatedAt(DateUtils.format(branch.getUpdatedAt()))
            .build();

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, responseDto);
    }

    @Override
    @Transactional
    public ResponseDto<BranchResponseDto> updateBranch(Long branchId, BranchUpdateRequestDto dto) {
        BranchResponseDto responseDto = null;
        Branch branch = null;

        branch = branchRepository.findById(branchId)
            .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 지점 아이디입니다."));

        branch.setBranchName(dto.getBranchName());
        branch.setBranchLocation(dto.getBranchLocation());

        Branch updateBranch = branchRepository.save(branch);

        responseDto = BranchResponseDto.builder()
            .branchName(updateBranch.getBranchName())
            .branchLocation(updateBranch.getBranchLocation())
            .build();

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, responseDto);
    }
}
