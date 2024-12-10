package com.test.project.api;


import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
public class ApiController {

	@Value("${api.cert.key}")
    private String certKey;

    @Value("${api.cert.id}")
    private String certId;
	
	
    private final String API_URL = "http://www.kamis.or.kr/service/price/xml.do";
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;  // JSON 변환을 위한 ObjectMapper

    public ApiController(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/api/price")
    public ApiResponseDTO getPriceInfo(
        @RequestParam String p_cert_key,
        @RequestParam String p_cert_id,
        @RequestParam String p_returntype,
        @RequestParam(required = false) String p_product_cls_code, // 기본값 설정 가능
        @RequestParam(required = false) String p_item_category_code,
        @RequestParam(required = false) String p_country_code,
        @RequestParam(required = false) String p_regday,
        @RequestParam(required = false) String p_convert_kg_yn
    ) {
        // 기본 파라미터 값 설정
        if (p_product_cls_code == null) p_product_cls_code = "02";  // 기본값: 도매
        if (p_item_category_code == null) p_item_category_code = "100";  // 기본값: 식량작물
        if (p_country_code == null) p_country_code = "전체지역";  // 기본값: 전체지역
        if (p_regday == null) p_regday = "최근 조사일자";  // 기본값: 최근 조사일자
        if (p_convert_kg_yn == null) p_convert_kg_yn = "N";  // 기본값: 정보조사 단위

        // URL 쿼리 파라미터 구성
        String url = String.format(
            "%s?action=dailyPriceByCategoryList&p_product_cls_code=%s&p_country_code=%s&p_regday=%s&p_convert_kg_yn=%s&p_item_category_code=%s&p_cert_key=%s&p_cert_id=%s&p_returntype=%s",
            API_URL,
            p_product_cls_code, p_country_code, p_regday, p_convert_kg_yn, p_item_category_code, p_cert_key, p_cert_id, p_returntype
        );

        // API 호출
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // JSON 응답을 DTO로 변환
        try {
        	ApiResponseDTO priceResponseDto = objectMapper.readValue(response.getBody(), ApiResponseDTO.class);
            return priceResponseDto;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 품목명 검색 API (예시)
    @GetMapping("/searchItem")
    public String searchItemByName(@RequestParam String itemName) {
        // 품목명으로 검색한 결과를 반환하는 로직
        // 실제 DB나 외부 API에서 품목 정보를 조회하는 로직을 여기에 작성할 수 있습니다.
        return "검색된 품목명: " + itemName;
    }
}