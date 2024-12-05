package com.test.project.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductEntity {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 기본키

    private String productClsCode;  // 구분 (01:소매, 02:도매)
    private String productClsName;  // 구분 이름
    private String categoryCode;    // 부류코드
    private String condition;       // 요청 메세지
    private String price;           // 응답 메세지
	
}
