package com.test.project.api;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class ApiService {

    private final RestTemplate restTemplate;

    public ApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getPriceData(String certKey, String certId, String productClsCode, String itemCategoryCode, String countryCode, String regday, String convertKgYn) {
        String apiUrl = "http://www.kamis.or.kr/service/price/xml.do";
        
        // URL 빌드
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(apiUrl)
            .queryParam("action", "dailyPriceByCategoryList")
            .queryParam("p_product_cls_code", productClsCode)
            .queryParam("p_country_code", countryCode)
            .queryParam("p_regday", regday)
            .queryParam("p_convert_kg_yn", convertKgYn)
            .queryParam("p_item_category_code", itemCategoryCode)
            .queryParam("p_cert_key", certKey)
            .queryParam("p_cert_id", certId)
            .queryParam("p_returntype", "json");

        // 요청을 보냄
        return restTemplate.getForObject(uriBuilder.toUriString(), String.class);
    }
}