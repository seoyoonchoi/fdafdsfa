package com.example.bookhub_back.dto.statistics.projection;

public interface ZeroStockProjection {
    String getBranchName();

    Long getZeroStockCount();
}
