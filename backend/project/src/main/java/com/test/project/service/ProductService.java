package com.test.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.test.project.config.AppConfig;
import com.test.project.dto.ProductDTO;
import com.test.project.entity.ProductEntity;
import com.test.project.persistence.ProductRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ProductService {

	@Value("${external-api.url}") // application.yml에서 외부 API URL 읽기
	private String apiUrl;

	@Value("${external-api.api-key}") // application.yml에서 API Key 읽기
	private String apiKey;

	private final RestTemplate restTemplate;

	@Autowired
	public ProductService(RestTemplate restTemplate) {
		this.restTemplate = restTemplate; // 생성자 주입
	}

	public ProductDTO getProductFromApi(String url) {
		try {
			log.info("Requesting data from URL: {}", url);
			// API에서 JSON 데이터를 받아와서 ProductDTO로 변환
			ProductDTO product = restTemplate.getForObject(url, ProductDTO.class);

			// 데이터 로그 출력
			log.info("Received product data: {}", product);
			return product;
		} catch (Exception e) {
			log.error("Error occurred while calling the API", e);
			throw new RuntimeException("Failed to fetch data from API", e);
		}
	}

}
