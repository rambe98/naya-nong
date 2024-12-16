package com.test.project.api;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

@RestController
@RequestMapping("/retail")
public class ApiRetailController {

    @Autowired
    private ApiRetailService apiService;

    // 전체 소매가격 데이터 조회
    @PostMapping("/price/all")
    public ResponseEntity<Map<String, Object>> getAllRetailPriceInfo(@RequestBody PriceRequestDTO priceRequestDTO) {
        try {
            // p_countrycode 필드에서만 <br> 태그 처리
            String processedCountryCode = Jsoup.clean(
                    HtmlUtils.htmlUnescape(priceRequestDTO.getP_countrycode()),
                    Safelist.none().addTags("br")
            );

            // 페이징 데이터 가져오기
            List<PriceDataDTO> priceDataList = apiService.getAllRetailPriceData(
                    priceRequestDTO.getP_startday(),
                    priceRequestDTO.getP_endday(),
                    priceRequestDTO.getP_itemcategorycode(),
                    priceRequestDTO.getP_itemcode(),
                    priceRequestDTO.getP_kindcode(),
                    priceRequestDTO.getP_productrankcode(),
                    processedCountryCode,
                    priceRequestDTO.getP_returntype(),
                    priceRequestDTO.getOffset(),
                    priceRequestDTO.getLimit()  // 전달된 offset과 limit 값 사용
            );

            // 전체 데이터 개수 가져오기 (Optional)
            int totalCount = apiService.getTotalCount(
                    priceRequestDTO.getP_startday(),
                    priceRequestDTO.getP_endday(),
                    priceRequestDTO.getP_itemcategorycode(),
                    priceRequestDTO.getP_itemcode(),
                    priceRequestDTO.getP_kindcode(),
                    priceRequestDTO.getP_productrankcode(),
                    processedCountryCode
            );

            // 결과 반환
            Map<String, Object> response = new HashMap<>();
            response.put("totalCount", totalCount);
            response.put("data", priceDataList);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}

