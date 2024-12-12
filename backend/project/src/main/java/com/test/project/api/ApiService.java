package com.test.project.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Service
public class ApiService {

    private final RestTemplate restTemplate;

    @Autowired
    private ItemMappingService itemMappingService;  // ItemMappingService 주입

    @Value("${api.cert.key}")
    private String certKey;

<<<<<<< HEAD:backend/project/src/main/java/com/test/project/api/ApiRetailService.java
    @Value("${api.cert.id}")
    private String certId;

    public ApiRetailService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
=======
	public ApiService(RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}

	// 전체 가격 데이터 조회 메서드
	public List<PriceDataDTO> getAllPriceData(String p_startday, String p_endday, String p_itemcategorycode,
			String p_itemcode, String p_kindcode, String p_productrankcode, String p_countrycode, String p_returntype) {
		try {
			// API URL 구성
			String apiUrl = "http://www.kamis.or.kr/service/price/xml.do";
>>>>>>> parent of 425bfef (open API modification):backend/project/src/main/java/com/test/project/api/ApiService.java

    // 외부 API 호출과 매핑된 품목 정보 추가
    public List<PriceDataDTO> getRetailPriceInfo(String itemName, String p_startday, String p_endday,String p_contrycode, String p_returntype) {
        try {
            // ItemMappingService를 이용하여 품목에 맞는 값을 찾기
            ItemMapping itemMapping = itemMappingService.getMappingByItemName(itemName);

            if (itemMapping == null) {
                throw new RuntimeException("Invalid item name provided");
            }

<<<<<<< HEAD:backend/project/src/main/java/com/test/project/api/ApiRetailService.java
            // PriceRequestDTO 생성
            PriceRequestDTO priceRequestDTO = new PriceRequestDTO();
            priceRequestDTO.setP_startday(p_startday);
            priceRequestDTO.setP_endday(p_endday);
            priceRequestDTO.setP_itemcategorycode(itemMapping.getItemCategoryCode());
            priceRequestDTO.setP_itemcode(itemMapping.getItemCategoryCode());
            priceRequestDTO.setP_kindcode(itemMapping.getKindCode());
            priceRequestDTO.setP_productrankcode("");  // 필요 시 추가 처리
            priceRequestDTO.setP_countrycode("1101");  // 예시 값, 실제 값으로 수정
            priceRequestDTO.setP_returntype(p_returntype);

            // API 호출
            String apiUrl = "http://www.kamis.or.kr/service/price/xml.do";
            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("action", "periodRetailProductList")
                    .queryParam("p_startday", priceRequestDTO.getP_startday())
                    .queryParam("p_endday", priceRequestDTO.getP_endday())
                    .queryParam("p_itemcategorycode", priceRequestDTO.getP_itemcategorycode())
                    .queryParam("p_itemcode", priceRequestDTO.getP_itemcode())
                    .queryParam("p_kindcode", priceRequestDTO.getP_kindcode())
                    .queryParam("p_productrankcode", priceRequestDTO.getP_productrankcode())
                    .queryParam("p_countrycode", priceRequestDTO.getP_countrycode())
                    .queryParam("p_cert_key", certKey)
                    .queryParam("p_cert_id", certId)
                    .queryParam("p_returntype", priceRequestDTO.getP_returntype());

            // API 호출
            ResponseEntity<String> response = restTemplate.getForEntity(uriBuilder.toUriString(), String.class);
=======
			// 응답 JSON 파싱
			return parsePriceData(response.getBody());
		} catch (Exception e) {
			throw new RuntimeException("Error fetching price data", e);
		}
	}

	
	public List<PriceDataDTO> getPriceData(String p_startday, String p_endday, String p_itemcategorycode,
			String p_itemcode, String p_kindcode, String p_productrankcode, String p_countrycode, String p_returntype) {
		try {
			// API URL 구성
			String apiUrl = "http://www.kamis.or.kr/service/price/xml.do";

			UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(apiUrl)
					.queryParam("action", "periodRetailProductList").queryParam("p_startday", p_startday)
					.queryParam("p_endday", p_endday).queryParam("p_itemcategorycode", p_itemcategorycode)
					.queryParam("p_itemcode", p_itemcode).queryParam("p_kindcode", p_kindcode)
					.queryParam("p_productrankcode", p_productrankcode).queryParam("p_countrycode", p_countrycode)
					.queryParam("p_cert_key", certKey).queryParam("p_cert_id", certId)
					.queryParam("p_returntype", p_returntype);
>>>>>>> parent of 425bfef (open API modification):backend/project/src/main/java/com/test/project/api/ApiService.java

            // 응답 데이터 처리
            return parseRetailPriceData(response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching price data", e);
        }
    }

<<<<<<< HEAD:backend/project/src/main/java/com/test/project/api/ApiRetailService.java
    // 외부 API 응답 데이터를 PriceDataDTO로 변환
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
=======
			// 응답 JSON 파싱
			return parsePriceData(response.getBody());
		} catch (Exception e) {
			throw new RuntimeException("Error fetching price data", e);
		}
	}

	private List<PriceDataDTO> parsePriceData(String responseBody) {
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

	// 평균 값만 필터링하고 필요한 필드만 반환하는 메서드
	public List<PriceDataDTO> filterByCountynameAverage(List<PriceDataDTO> priceDataList) {
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
	
	public List<PriceDataDTO> filterByMarketnameNotNull(List<PriceDataDTO> priceDataList) {
	    List<PriceDataDTO> filteredList = new ArrayList<>();
	    for (PriceDataDTO dto : priceDataList) {
	        if (dto.getMarketname() != null && !"null".equals(dto.getMarketname())) {
	            filteredList.add(dto);
	        }
	    }
	    return filteredList;
	}
>>>>>>> parent of 425bfef (open API modification):backend/project/src/main/java/com/test/project/api/ApiService.java
}
