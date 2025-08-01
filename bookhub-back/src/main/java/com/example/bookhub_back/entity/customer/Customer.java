package com.example.bookhub_back.entity.customer;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customer")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_email", nullable = false, unique = true)
    private String customerEmail;

    @Column(name = "customer_phone_number", nullable = false, unique = true)
    private String customerPhoneNumber;

    @Column(name = "customer_address", nullable = false)
    private String customerAdderess;

    @CreatedDate
    @Column(name = "customer_created_at", nullable = false, updatable = false)
    private LocalDate customerCreatedAt;

    @OneToMany(mappedBy = "customerId")
    private List<CustomerOrder> customerOrders = new ArrayList<>();
}
