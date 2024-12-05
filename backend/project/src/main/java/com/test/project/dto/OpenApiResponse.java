package com.test.project.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class OpenApiResponse {

    private String error_code;
    private List<Price> price;

    // 내부 클래스 Price
    @Data
    public static class Price {

        @JsonProperty("productno")
        private String productNo;  // 품목코드

        @JsonProperty("category_code")
        private String categoryCode;  // 부류코드

        @JsonProperty("productName")
        private String productName;  // 품목명
    }
}