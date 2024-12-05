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

	@JsonProperty("productno") // 품목코드
	private String productNo;

	@JsonProperty("category_code") // 부류코드
	private String categoryCode;

	@JsonProperty("productName") // 품목명
	private String productName;

}
