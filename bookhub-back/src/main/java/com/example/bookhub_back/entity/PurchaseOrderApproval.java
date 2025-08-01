package com.example.bookhub_back.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "purchase_order_approvals")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class PurchaseOrderApproval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchase_order_approval_id")
    private Long purchaseOrderApprovalId;

    @Column(name = "is_approved", nullable = false)
    private boolean isApproved;

    @Column(name = "created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    // 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_approval_employee_id")
    private Employee employeeId; // 승인한 담당자

    @OneToOne
    @JoinColumn(name = "purchase_order_id")
    private PurchaseOrder purchaseOrderId;

}
