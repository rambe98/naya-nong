package com.test.project.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;


@Data
public class PriceResponse {

    @JsonProperty("condition")
    private List<List<String>> condition;

    @JsonProperty("error_code")
    private String errorCode;

    @JsonProperty("price")
    private List<Price> price;

    @Data
    public static class Price {

        @JsonProperty("product_cls_code")
        private String productClsCode;

        @JsonProperty("product_cls_name")
        private String productClsName;

        @JsonProperty("category_code")
        private String categoryCode;

        @JsonProperty("category_name")
        private String categoryName;

        @JsonProperty("productno")
        private String productNo;

        @JsonProperty("lastest_date")
        private String latestDate;

        @JsonProperty("productName")
        private String productName;

        @JsonProperty("item_name")
        private String itemName;

        @JsonProperty("unit")
        private String unit;

        @JsonProperty("day1")
        private String day1;

        @JsonProperty("dpr1")
        private String dpr1;

        @JsonProperty("day2")
        private String day2;

        @JsonProperty("direction")
        private String direction;

    }
}
