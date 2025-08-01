package com.example.bookhub_back.entity;

import jakarta.persistence.*;
import lombok.*;
import com.example.bookhub_back.common.enums.StockActionType;

import java.time.LocalDate;

@Entity
@Table(name = "stock_logs")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class StockLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private StockActionType stockActionType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_isbn")
    private Book bookIsbn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branchId;

    //변경량
    @Column(name = "amount", nullable = false)
    private Long amount;

    //누적량
    @Column(name = "book_amount", nullable = false)
    private Long bookAmount;

    @Column(name = "action_date", nullable = false)
    private LocalDate actionDate;

    @Lob
    @Column(name = "description")
    private String description;
}