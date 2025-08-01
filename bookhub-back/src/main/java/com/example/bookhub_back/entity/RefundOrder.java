package com.example.bookhub_back.entity;

import com.example.bookhub_back.common.enums.RefundReason;
import com.example.bookhub_back.entity.customer.CustomerOrder;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "refund_orders")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class RefundOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refund_order_id")
    private Long refundOrderId;

    @Column(name = "refund_date_at")
    @CreatedDate
    private LocalDateTime refundDateAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "refund_reason", nullable = false)
    private RefundReason refundReason;

    // 참조
    @OneToOne
    @JoinColumn(name = "order_id")
    private CustomerOrder orderId;
}