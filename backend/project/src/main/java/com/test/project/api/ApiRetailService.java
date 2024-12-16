package com.test.project.api;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

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
        @Autowired
        private EntityManager entityManager;  // EntityManager를 사용하여 JPQL 쿼리 실행

        // 전체 소매 가격 데이터를 가져오는 메서드 (페이징 포함)
        public List<PriceDataDTO> getAllRetailPriceData(String startDay, String endDay, String itemCategoryCode, String itemCode,
                                                         String kindCode, String productRankCode, String countryCode, 
                                                         String returnType, int offset, int limit) {

            // JPQL 쿼리 작성 (페이징을 고려한 쿼리)
            String jpql = "SELECT p FROM PriceDataEntity p WHERE " +
                          "p.startDay >= :startDay AND p.endDay <= :endDay AND " +
                          "p.itemCategoryCode = :itemCategoryCode AND p.itemCode = :itemCode AND " +
                          "p.kindCode = :kindCode AND p.productRankCode = :productRankCode AND p.countryCode = :countryCode";

            Query query = entityManager.createQuery(jpql);
            query.setParameter("startDay", startDay);
            query.setParameter("endDay", endDay);
            query.setParameter("itemCategoryCode", itemCategoryCode);
            query.setParameter("itemCode", itemCode);
            query.setParameter("kindCode", kindCode);
            query.setParameter("productRankCode", productRankCode);
            query.setParameter("countryCode", countryCode);

            // 페이징 처리
            query.setFirstResult(offset);
            query.setMaxResults(limit);

            // 결과 반환
            return query.getResultList();
        }

        // 전체 데이터 개수 조회 메서드
        public int getTotalCount(String startDay, String endDay, String itemCategoryCode, String itemCode,
                                 String kindCode, String productRankCode, String countryCode) {
            // JPQL 쿼리 작성 (조건에 맞는 데이터 개수를 반환)
            String jpql = "SELECT COUNT(p) FROM PriceDataEntity p WHERE " +
                          "p.startDay >= :startDay AND p.endDay <= :endDay AND " +
                          "p.itemCategoryCode = :itemCategoryCode AND p.itemCode = :itemCode AND " +
                          "p.kindCode = :kindCode AND p.productRankCode = :productRankCode AND p.countryCode = :countryCode";

            Query query = entityManager.createQuery(jpql);
            query.setParameter("startDay", startDay);
            query.setParameter("endDay", endDay);
            query.setParameter("itemCategoryCode", itemCategoryCode);
            query.setParameter("itemCode", itemCode);
            query.setParameter("kindCode", kindCode);
            query.setParameter("productRankCode", productRankCode);
            query.setParameter("countryCode", countryCode);

            // 쿼리 실행하고 결과 반환
            return ((Long) query.getSingleResult()).intValue();
        }

    // 소매가격 데이터를 파싱하여 DTO로 변환
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

    // 소매 지역 조회
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
