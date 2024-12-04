package com.test.project.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "product")
public class ProductEntity {

    @Id
    private Long id; // 기본 키

    private String pCertKey;
    private String pCertId;
    private String pReturnType;
    private String price;
}
