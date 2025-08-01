package com.example.bookhub_back.entity;

import com.example.bookhub_back.common.enums.BookLogType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "book_logs")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class BookLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_log_id")
    private Long bookLogId;

    @Enumerated(EnumType.STRING)
    @Column(name = "log_type", nullable = false)
    private BookLogType bookLogType;

    @Column(name = "previous_price")
    private Long previousPrice;

    @Column(name = "previous_discount_rate")
    private Long previousDiscountRate;

    @Column(name = "changed_at")
    @CreatedDate
    private LocalDateTime changedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employeeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id")
    private Policy policyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_isbn")
    private Book bookIsbn;
}