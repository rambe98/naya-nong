package com.test.project.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class ApiService {

	private final RestTemplate restTemplate;

	@Value("${api.cert.key}")
	private String certKey;

	@Value("${api.cert.id}")
	private String certId;

	public ApiService(RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}

	 public String getPriceData(String startDate, String endDate, String itemCategoryCode, String itemCode,
	            String kindCode, String productRankCode, String countryCode, String certKey, String certId, String returnType) throws Exception {

	        // API URL 및 파라미터 구성
	        String apiUrl = "http://www.kamis.or.kr/service/price/xml.do";

	        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(apiUrl)
	                .queryParam("action", "periodRetailProductList")
	                .queryParam("p_startday", startDate)
	                .queryParam("p_endday", endDate)
	                .queryParam("p_itemcategorycode", itemCategoryCode)
	                .queryParam("p_itemcode", itemCode)
	                .queryParam("p_kindcode", kindCode)
	                .queryParam("p_productrankcode", productRankCode)
	                .queryParam("p_countrycode", countryCode)
	                .queryParam("p_convert_kg_yn", "Y")
	                .queryParam("p_cert_key", certKey) // 인증 Key
	                .queryParam("p_cert_id", certId)  // 인증 ID
	                .queryParam("p_returntype", returnType); // 응답 타입 JSON

	        // API 요청 보내기
	        ResponseEntity<String> response = restTemplate.getForEntity(uriBuilder.toUriString(), String.class);

	        return response.getBody();
	    }
}