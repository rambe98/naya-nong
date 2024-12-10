package com.test.project.api;

import lombok.Data;

@Data
public class RequestDTO {
    private String startDate;
    private String endDate;
    private String itemCategoryCode;
    private String itemCode;
    private String kindCode;
    private String productRankCode;
    private String countryCode;
    private String certKey;  // API 인증 키
    private String certId;   // API 인증 ID
    private String returnType; // JSON 또는 XML
}