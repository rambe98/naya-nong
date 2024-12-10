package com.test.project.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;


@Service
public class ApiService {

	@Value("${api.cert.key}")
	private String certKey;

	@Value("${api.cert.id}")
	private String certId;

	@Value("${api.base-url}")
	private String baseUrl;

	@Value("${api.return-type}")
	private String returnType;

	private final RestTemplate restTemplate;

    @Autowired
    public ApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ApiResponseDTO searchItem(String itemName, String itemCategoryCode) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("action", "dailyPriceByCategoryList")
                .queryParam("p_product_cls_code", "02") // 도매
                .queryParam("p_country_code", "1101") // 서울
                .queryParam("p_item_category_code", itemCategoryCode) // 부류코드
                .queryParam("p_cert_key", certKey)
                .queryParam("p_cert_id", certId)
                .queryParam("p_returntype", returnType)
                .queryParam("p_regday", "2024-12-09") // 기본 날짜
                .queryParam("p_convert_kg_yn", "N") // kg 단위 환산 여부
                .toUriString();

        ResponseEntity<ApiResponseDTO> response = restTemplate.exchange(url, HttpMethod.GET, null, ApiResponseDTO.class);
        return response.getBody();
    }
}