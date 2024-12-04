package com.test.project.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.test.project.persistence.ProductRepository;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    @Value("${external-api.api-key}")  // application.yml에서 API 키 읽어오기
    private String apiKey;

    @Value("${external-api.api-id}")  // application.yml에서 ID 읽어오기
    private String apiId;

    private final RestTemplate restTemplate;
    private final ProductRepository productRepository;

    public ProductService(RestTemplate restTemplate, ProductRepository productRepository) {
        this.restTemplate = restTemplate;
        this.productRepository = productRepository;
    }

    @Transactional
    public void fetchAndSaveProduct(String startDate, String endDate) throws Exception {
        // 요청을 보낼 URL
        String apiUrl = "http://www.kamis.or.kr/service/price/xml.do?action=dailySalesList";

        // URL에 추가할 매개변수
        String certKey = apiKey;
        String certId = apiId;
        String returnType = "json";  // JSON 형식으로 응답을 받기 위해 설정

        // URL 생성
        String url = UriComponentsBuilder.fromHttpUrl(apiUrl)
                .queryParam("p_cert_key", certKey)
                .queryParam("p_cert_id", certId)
                .queryParam("p_returntype", returnType)
                .queryParam("p_startday", startDate)
                .queryParam("p_endday", endDate)
                .toUriString();

        // RestTemplate을 사용하여 API 요청
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, null, String.class);

        // 응답 코드 확인
        if (response.getStatusCode() == HttpStatus.OK) {
            // 응답 내용 처리 (JSON 파싱)
            String responseBody = response.getBody();
            System.out.println("Response: " + responseBody);
            
            // JSON 응답 파싱
            JSONParser parser = new JSONParser();
            JSONObject obj = (JSONObject) parser.parse(responseBody);
            JSONArray priceArray = (JSONArray) obj.get("price");

            // 가격 정보를 DB에 저장
            for (int i = 0; i < priceArray.length(); i++) {
                JSONObject priceData = priceArray.getJSONObject(i);
                ProductDTO productDTO = new ProductDTO();
                productDTO.setpCertKey(certKey);
                productDTO.setpCertId(certId);
                productDTO.setpReturnType(returnType);
                productDTO.setPrice(priceData.toString());

                // ProductDTO -> ProductEntity 변환하여 DB에 저장
                ProductEntity productEntity = productDTO.toEntity();
                productRepository.save(productEntity);
            }
        } else {
            throw new RuntimeException("Failed to fetch data from API, response code: " + response.getStatusCode());
        }
    }
}


