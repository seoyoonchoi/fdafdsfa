package com.example.bookhub_back.dto.branch.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BranchResponseDto {
    private Long branchId;
    private String branchName;
    private String branchLocation;
    private String createdAt;
    private String updatedAt;
}
