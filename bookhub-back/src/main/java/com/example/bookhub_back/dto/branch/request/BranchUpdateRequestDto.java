package com.example.bookhub_back.dto.branch.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BranchUpdateRequestDto {
    @NotBlank(message = "지점 명을 입력하세요.")
    private String branchName;

    @NotBlank(message = "지점 위치를 입력하세요.")
    private String branchLocation;
}
