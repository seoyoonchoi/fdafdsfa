package com.example.bookhub_back.repository.customer;

import com.example.bookhub_back.entity.customer.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer,Long> {
}
