package com.test.project.api;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ApiRetailService {

	private final RestTemplate restTemplate;

	@Value("${api.cert.key}")
	private String certKey;

	@Value("${api.cert.id}")
	private String certId;

	public ApiRetailService(RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}

	// 전체 소매가격 데이터 조회
	public List<PriceDataDTO> getAllRetailPriceData(String p_startday, String p_endday, String p_itemcategorycode,
			String p_itemcode, String p_kindcode, String p_productrankcode, String p_countrycode, String p_returntype) {
		try {
			// API URL 구성
			String apiUrl = "http://www.kamis.or.kr/service/price/xml.do";

			UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(apiUrl)
					.queryParam("action", "periodRetailProductList")
					.queryParam("p_startday", p_startday)
					.queryParam("p_endday", p_endday)
					.queryParam("p_itemcategorycode", p_itemcategorycode)
					.queryParam("p_itemcode", p_itemcode)
					.queryParam("p_kindcode", p_kindcode)
					.queryParam("p_productrankcode", p_productrankcode)
					.queryParam("p_countrycode", p_countrycode)
					.queryParam("p_cert_key", certKey)
					.queryParam("p_cert_id", certId)
					.queryParam("p_returntype", p_returntype);

			// API 호출
			ResponseEntity<String> response = restTemplate.getForEntity(uriBuilder.toUriString(), String.class);

			// 응답 JSON 파싱
			return parseRetailPriceData(response.getBody());
		} catch (Exception e) {
			throw new RuntimeException("Error fetching price data", e);
		}
	}

	
	public List<PriceDataDTO> getRetailPriceData(String p_startday, String p_endday, String p_itemcategorycode,
			String p_itemcode, String p_kindcode, String p_productrankcode, String p_countrycode, String p_returntype) {
		try {
			// API URL 구성
			String apiUrl = "http://www.kamis.or.kr/service/price/xml.do";

			UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(apiUrl)
					.queryParam("action", "periodRetailProductList")
					.queryParam("p_startday", p_startday)
					.queryParam("p_endday", p_endday)
					.queryParam("p_itemcategorycode", p_itemcategorycode)
					.queryParam("p_itemcode", p_itemcode)
					.queryParam("p_kindcode", p_kindcode)
					.queryParam("p_productrankcode", p_productrankcode)
					.queryParam("p_countrycode", p_countrycode)
					.queryParam("p_cert_key", certKey)
					.queryParam("p_cert_id", certId)
					.queryParam("p_returntype", p_returntype);

			// API 호출
			ResponseEntity<String> response = restTemplate.getForEntity(uriBuilder.toUriString(), String.class);

			// 응답 JSON 파싱
			return parseRetailPriceData(response.getBody());
		} catch (Exception e) {
			throw new RuntimeException("Error fetching price data", e);
		}
	}

	private List<PriceDataDTO> parseRetailPriceData(String responseBody) {
		List<PriceDataDTO> priceDataList = new ArrayList<>();
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode dataNode = objectMapper.readTree(responseBody).path("data").path("item");

			for (JsonNode node : dataNode) {
				PriceDataDTO dto = new PriceDataDTO();
				dto.setItemname(node.path("itemname").asText());
				dto.setKindname(node.path("kindname").asText());
				dto.setCountyname(node.path("countyname").asText());
				dto.setMarketname(node.path("marketname").asText());
				dto.setYyyy(node.path("yyyy").asText());
				dto.setRegday(node.path("regday").asText());
				dto.setPrice(node.path("price").asText());
				priceDataList.add(dto);
			}
		} catch (Exception e) {
			throw new RuntimeException("Error parsing API response", e);
		}
		return priceDataList;
	}
	

	// 소매 평균 조회
	public List<PriceDataDTO> filterByCountynameRetailAverage(List<PriceDataDTO> priceDataList) {
		List<PriceDataDTO> filteredList = new ArrayList<>();
		for (PriceDataDTO dto : priceDataList) {
			if ("평균".equals(dto.getCountyname())) {
				// 필요한 필드만 설정하여 List에 추가
				PriceDataDTO filteredDto = new PriceDataDTO();
				filteredDto.setCountyname(dto.getCountyname());
				filteredDto.setYyyy(dto.getYyyy());
				filteredDto.setRegday(dto.getRegday());
				filteredDto.setPrice(dto.getPrice());
				
				filteredList.add(filteredDto);
			}
		}
		return filteredList;
	}
	
	//소매 지역 조회
	public List<PriceDataDTO> filterByMarketnameNotNull(List<PriceDataDTO> priceDataList) {
	    List<PriceDataDTO> filteredList = new ArrayList<>();
	    for (PriceDataDTO dto : priceDataList) {
	        if (dto.getMarketname() != null && !"null".equals(dto.getMarketname())) {
	            filteredList.add(dto);
	        }
	    }
	    return filteredList;
	}
	
	
	
}
