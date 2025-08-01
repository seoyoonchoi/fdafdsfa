package com.example.bookhub_back.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "publishers")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Publisher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "publisher_id")
    private Long publisherId;

    @Column (name = "publisher_name", nullable = false, unique = true)
    private String publisherName;

    @OneToMany(mappedBy = "publisherId")
    private List<Book> books = new ArrayList<>();

}
