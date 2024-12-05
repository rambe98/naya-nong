package com.test.project.service;
import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.test.project.dto.OpenApiProductDTO;
import com.test.project.entity.ProductEntity;
import com.test.project.persistence.ProductRepository;

import org.springframework.stereotype.Service;

@Service
public class ProductService {
	
	 @Autowired
	    private RestTemplate restTemplate;

	    private static final String API_URL = "http://www.kamis.co.kr/service/price/xml.do?action=dailySalesList&p_cert_key=202671f9-de02-4f98-a13b-87747d743f06&p_cert_id=test&p_returntype=json"
	    		+ "";

	    public void fetchDataAndSave() {
	        try {
	            // Accept 헤더 설정
	            HttpHeaders headers = new HttpHeaders();
	            headers.set("Accept", "application/xml");  // 서버가 XML을 반환한다고 예상되므로 application/xml 설정

	            HttpEntity<String> entity = new HttpEntity<>(headers);

	            // API 호출
	            ResponseEntity<String> responseEntity = restTemplate.exchange(API_URL, HttpMethod.GET, entity, String.class);

	            // 응답 본문을 출력 (디버깅용)
	            String responseBody = responseEntity.getBody();
	            System.out.println("Response Body: " + responseBody);

	            // 응답 JSON을 파싱해서 DTO로 변환
	            ObjectMapper objectMapper = new ObjectMapper();
	            OpenApiProductDTO productDTO = objectMapper.readValue(responseBody, OpenApiProductDTO.class);

	            // DTO에서 필요한 데이터만 추출하여 DB에 저장
	            saveToDatabase(productDTO);

	        } catch (RestClientException e) {
	            System.err.println("API 호출 오류: " + e.getMessage());
	        } catch (Exception e) {
	            System.err.println("응답 처리 오류: " + e.getMessage());
	        }
	    }

	    private void saveToDatabase(OpenApiProductDTO productDTO) {
	        // 여기에 DB 저장 로직을 추가합니다.
	        // 예: repository.save(productDTO);
	        System.out.println("DB에 저장된 제품 정보: " + productDTO);
	    }
}