//CustomerOrder
package com.example.bookhub_back.entity.customer;

import com.example.bookhub_back.entity.Branch;
import com.example.bookhub_back.entity.Policy;
import com.example.bookhub_back.entity.RefundOrder;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "customer_orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class CustomerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_order_id")
    private Long customerOrderId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customerId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branchId;

    @Column(name = "customer_order_total_amount", nullable = false)
    private Long totalAmount;

    @Column(name = "customer_order_total_price", nullable = false)
    private Long totalPrice;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "applied_policy_id")
    private Policy appliedPolicyId;

    @CreatedDate
    @Column(name = "customer_order_date_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "customerOrderDetailId")
    private List<CustomerOrderDetail> customerOrderDetails = new ArrayList<>();

    @OneToOne(mappedBy = "orderId", cascade = CascadeType.ALL)
    private RefundOrder refundOrderId;

}
