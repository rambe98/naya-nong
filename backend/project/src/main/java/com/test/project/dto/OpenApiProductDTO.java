package com.test.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OpenApiProductDTO {

	@JsonProperty("condition")
	private String condition; // 요청 메세지

	@JsonProperty("price")
	private String price; // 응답 메세지

	@JsonProperty("product_cls_code")
	private String productClsCode; // 구분 (01:소매, 02:도매)

	@JsonProperty("product_cls_name")
	private String productClsName; // 구분 이름

	@JsonProperty("category_code")
	private String categoryCode; // 부류코드
}
