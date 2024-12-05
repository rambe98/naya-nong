package com.test.project.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class OpenApiEntity {

	@Id
    private String productNo;  // 품목코드 (PK)

    @Column(nullable = false)
    private String categoryCode;  // 부류코드

    @Column(nullable = false)
    private String productName;  // 품목명
	
}
