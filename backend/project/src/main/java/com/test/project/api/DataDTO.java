package com.test.project.api;

import java.util.List;

import lombok.Data;

@Data
public class DataDTO {
    private String error_code;    // 에러 코드
    private List<PriceInfoDTO> item; // 품목 정보 (목록)
}