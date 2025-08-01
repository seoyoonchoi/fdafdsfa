package com.example.bookhub_back.entity;

import com.example.bookhub_back.common.enums.PurchaseOrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "purchase_orders")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class PurchaseOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchase_order_id")
    private Long purchaseOrderId;

    @Column(name = "purchase_order_amount", nullable = false)
    private int purchaseOrderAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "purchase_order_status", nullable = false)
    private PurchaseOrderStatus purchaseOrderStatus;

    @Column(name = "purchase_order_date_at")
    @CreatedDate
    private LocalDateTime purchaseOrderDateAt;

    // 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branchId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_isbn")
    private Book bookIsbn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_employee_id")
    private Employee employeeId;

    @OneToOne(mappedBy = "purchaseOrderId", cascade = CascadeType.ALL)
    private PurchaseOrderApproval purchaseOrderApproval;
}
