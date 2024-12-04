package com.test.project.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductEntity {

	@Id
	private Long id;
	private String pStartday; // 시작일
	private String pEndday; // 종료일
	private String pProductClsCode; // 제품 분류 코드
	private String pItemCategoryCode; // 아이템 카테고리 코드
	private String pItemCode; // 아이템 코드
	private String pCountryCode;
}
