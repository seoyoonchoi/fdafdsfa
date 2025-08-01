package com.example.bookhub_back.mapper;

import com.example.bookhub_back.common.enums.PurchaseOrderStatus;
import com.example.bookhub_back.dto.purchaseOrder.response.PurchaseOrderResponseDto;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Mapper
public interface PurchaseOrderMapper {
    List<PurchaseOrderResponseDto> searchPurchaseOrder(@Param("employeeName") String employeeName, @Param("bookIsbn") String bookIsbn, @Param("purchaseOrderStatus") PurchaseOrderStatus purchaseOrderStatus);
}
