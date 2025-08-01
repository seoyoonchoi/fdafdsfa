package com.example.bookhub_back.dto.statistics.projection;

public interface BranchStockBarChartProjection {
    String getBranchName();
    Long getInAmount();
    Long getOutAmount();
    Long getLossAmount();
}
