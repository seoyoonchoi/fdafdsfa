package com.example.bookhub_back.repository.customer;

import com.example.bookhub_back.entity.RefundOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefundOrderRepository extends JpaRepository<RefundOrder,Long> {
}
