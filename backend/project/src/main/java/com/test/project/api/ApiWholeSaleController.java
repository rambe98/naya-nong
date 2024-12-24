package com.test.project.api;

import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;


@RestController
@RequestMapping("/wholeSale")
public class ApiWholeSaleController {
	
	@Autowired
	private ApiWholeSaleService wholeSaleService;
	
	  // 전체 도매가격 데이터 조회
    @PostMapping("/price/all")
    public ResponseEntity<List<PriceDataDTO>> getAllWholeSalePriceInfo(@RequestBody PriceRequestDTO priceRequestDTO) {
        try {
        	// p_countrycode 필드에서만 <br> 태그 처리
            String processedCountryCode = Jsoup.clean(//Jsoup 라이브러리에서 제공하는 HTML 정제 기능
                    HtmlUtils.htmlUnescape(priceRequestDTO.getP_countrycode()),//HTML 이스케이프 문자를 일반 텍스트로 변환
                    Safelist.none().addTags("br") // <br> 태그만 허용
            );
            // ApiService 호출하여 전체 데이터 리스트 얻기
            List<PriceDataDTO> allPriceDataList = wholeSaleService.getAllWholesalePriceData(
                    priceRequestDTO.getP_startday(),
                    priceRequestDTO.getP_endday(),
                    priceRequestDTO.getP_itemcategorycode(),
                    priceRequestDTO.getP_itemcode(),
                    priceRequestDTO.getP_kindcode(),
                    priceRequestDTO.getP_productrankcode(),
                    processedCountryCode,
                    priceRequestDTO.getP_returntype()
            );

            return ResponseEntity.ok(allPriceDataList);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    //도매 평균 조회
	@PostMapping("/price")
	public ResponseEntity<List<PriceDataDTO>> getWholeSalePriceInfo(@RequestBody PriceRequestDTO priceRequestDTO) {
		try {
			// ApiService 호출하여 원본 데이터 리스트 얻기
			List<PriceDataDTO> priceDataList = wholeSaleService.getWholesalePriceData(priceRequestDTO.getP_startday(),
					priceRequestDTO.getP_endday(), priceRequestDTO.getP_itemcategorycode(),
					priceRequestDTO.getP_itemcode(), priceRequestDTO.getP_kindcode(),
					priceRequestDTO.getP_productrankcode(), priceRequestDTO.getP_countrycode(),
					priceRequestDTO.getP_returntype());

			// "평균" 데이터만 필터링
			List<PriceDataDTO> filteredPriceDataList = wholeSaleService.filterByCountynameWholesaleAverage(priceDataList);

			// 필터링된 데이터 반환
			if (filteredPriceDataList.isEmpty()) {
				return ResponseEntity.noContent().build(); // 필터링된 데이터가 없으면 204 상태 코드 반환
			}

			return ResponseEntity.ok(filteredPriceDataList); // 필터링된 데이터를 200 상태 코드로 반환
		} catch (Exception e) {
			// 예외 발생 시 500 상태 코드 반환
			return ResponseEntity.status(500).body(null);
		}
	}
	
	
	//도매 지역 조회
	@PostMapping("/price/marketname")
	public ResponseEntity<List<PriceDataDTO>> getRetailPriceInfoByMarketname(@RequestBody PriceRequestDTO priceRequestDTO) {
	    try {
	        // ApiService 호출하여 전체 데이터 리스트 얻기
	        List<PriceDataDTO> priceDataList = wholeSaleService.getWholesalePriceData(
	                priceRequestDTO.getP_startday(),
	                priceRequestDTO.getP_endday(),
	                priceRequestDTO.getP_itemcategorycode(),
	                priceRequestDTO.getP_itemcode(),
	                priceRequestDTO.getP_kindcode(),
	                priceRequestDTO.getP_productrankcode(),
	                priceRequestDTO.getP_countrycode(),
	                priceRequestDTO.getP_returntype()
	        );

	        // marketname이 null이 아닌 데이터만 필터링
	        List<PriceDataDTO> filteredPriceDataList = wholeSaleService.filterByWholesaleMarketnameNotNull(priceDataList);

	        return ResponseEntity.ok(filteredPriceDataList);
	    } catch (Exception e) {
	        return ResponseEntity.status(500).build();
	    }
	}

}
