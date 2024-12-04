package com.test.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {

	@JsonProperty("county_code")  // JSON의 "county_code" 필드를 Java의 county_code 필드에 매핑
    private String countyCode;

    @JsonProperty("county_name")  // JSON의 "county_name" 필드를 Java의 county_name 필드에 매핑
    private String countyName;

    @JsonProperty("product_cls_code")  // JSON의 "product_cls_code" 필드를 Java의 product_cls_code 필드에 매핑
    private String productClsCode;
}
