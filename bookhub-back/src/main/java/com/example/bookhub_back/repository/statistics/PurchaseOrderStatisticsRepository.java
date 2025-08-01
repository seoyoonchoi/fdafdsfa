package com.example.bookhub_back.repository.statistics;

import com.example.bookhub_back.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseOrderStatisticsRepository extends JpaRepository<PurchaseOrder, Long> {
}
