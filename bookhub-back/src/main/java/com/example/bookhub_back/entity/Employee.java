package com.example.bookhub_back.entity;

import com.example.bookhub_back.common.enums.IsApproved;
import com.example.bookhub_back.common.enums.Status;
import com.example.bookhub_back.entity.dateTime.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Employee extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Long employeeId;

    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branchId;

    @ManyToOne
    @JoinColumn(name = "position_id", nullable = false)
    private Position positionId;

    @ManyToOne
    @JoinColumn(name = "authority_id", nullable = false)
    private Authority authorityId;

    @Column(name = "employee_number", nullable = false, unique = true)
    private long employeeNumber;

    @Column(name = "loginId", nullable = false, unique = true)
    private String loginId;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "phone_number", nullable = false, unique = true)
    private String phoneNumber;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "is_approved", nullable = false)
    @Enumerated(EnumType.STRING)
    private IsApproved isApproved = IsApproved.PENDING;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status = Status.EMPLOYED;
}
