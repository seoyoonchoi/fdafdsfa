package com.example.bookhub_back.entity;

import com.example.bookhub_back.common.enums.PolicyType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "policies")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Policy {

        @Id
        @GeneratedValue
        private Long policyId;

        @Column(name = "policy_title", nullable = false)
        private String policyTitle;

        @Column(name = "policy_description")
        private String policyDescription;

        @Enumerated(EnumType.STRING)
        @Column(name = "policy_type", nullable = false)
        private PolicyType policyType;

        @Column(name = "total_price_achieve")
        private Long totalPriceAchieve;

        @Column(name = "discount_percent", nullable = false)
        private Long discountPercent;

        @Column(name = "start_date")
        private LocalDate startDate;

        @Column(name = "end_date")
        private LocalDate endDate;
    }


