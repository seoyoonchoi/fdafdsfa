package com.example.bookhub_back.repository.customer;

import com.example.bookhub_back.entity.customer.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder,Long> {
}
