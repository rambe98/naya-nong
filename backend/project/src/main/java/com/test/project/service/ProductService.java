package com.test.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.test.project.config.AppConfig;
import com.test.project.dto.ProductDTO;
import com.test.project.entity.ProductEntity;
import com.test.project.persistence.ProductRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ProductService {

	private final ProductRepository productRepository;
	private final RestTemplate restTemplate;

	@Value("${external-api.url}") // application.yml에서 외부 API URL 읽기
	private String apiUrl;

	@Value("${external-api.api-key}") // application.yml에서 API Key 읽기
	private String apiKey;

	@Autowired
	public ProductService(ProductRepository productRepository, RestTemplate restTemplate) {
		this.productRepository = productRepository;
		this.restTemplate = restTemplate;
	}

	public ProductEntity fetchAndSaveProduct(String endDate) {
		// URL 생성: 필요한 파라미터를 바인딩하여 요청 URL을 만듦
		String url = UriComponentsBuilder.fromHttpUrl(apiUrl).queryParam("p_endday", endDate) // p_endday를 동적으로 설정
				.queryParam("p_productclscode", "02").queryParam("p_startday", "2024-11-01")
				.queryParam("p_itemcategorycode", "200").queryParam("p_itemcode", "212")
				.queryParam("p_countrycode", "1101").queryParam("p_convert_kg_yn", "Y").queryParam("p_cert_key", "111")
				.queryParam("p_cert_id", "222").queryParam("p_returntype", "json").queryParam("api_key", apiKey) // API
																													// Key
																													// 추가
				.toUriString();

		// API 요청
		ProductDTO[] productDTOs = restTemplate.getForObject(url, ProductDTO[].class);

		// 필요한 데이터만 추출하여 DB에 저장
		for (ProductDTO productDTO : productDTOs) {
			ProductEntity entity = productDTO.toEntity(); // DTO -> Entity 변환
			productRepository.save(entity); // DB에 저장
		}

		// DB에서 저장된 값 중 하나를 반환 (예시로 첫 번째 저장된 값을 반환)
		return productRepository.findAll().get(0); // 예시로 첫 번째 값을 리턴
	}
}
