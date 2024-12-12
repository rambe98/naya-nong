package com.test.project.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/retail")
public class ApiRetailController {

	@Autowired
	private ApiRetailService apiService;
	

    // 전체 소매가격 데이터 조회
    @PostMapping("/price/all")
    public ResponseEntity<List<PriceDataDTO>> getAllRetailPriceInfo(@RequestBody PriceRequestDTO priceRequestDTO) {
        try {
            // ApiService 호출하여 전체 데이터 리스트 얻기
            List<PriceDataDTO> allPriceDataList = apiService.getAllRetailPriceData(
                    priceRequestDTO.getP_startday(),
                    priceRequestDTO.getP_endday(),
                    priceRequestDTO.getP_itemcategorycode(),
                    priceRequestDTO.getP_itemcode(),
                    priceRequestDTO.getP_kindcode(),
                    priceRequestDTO.getP_productrankcode(),
                    priceRequestDTO.getP_countrycode(),
                    priceRequestDTO.getP_returntype()
            );

            return ResponseEntity.ok(allPriceDataList);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    //소매 평균 조회
	@PostMapping("/price")
	public ResponseEntity<List<PriceDataDTO>> getRetailPriceInfo(@RequestBody PriceRequestDTO priceRequestDTO) {
		try {
			// ApiService 호출하여 원본 데이터 리스트 얻기
			List<PriceDataDTO> priceDataList = apiService.getAllRetailPriceData(priceRequestDTO.getP_startday(),
					priceRequestDTO.getP_endday(), priceRequestDTO.getP_itemcategorycode(),
					priceRequestDTO.getP_itemcode(), priceRequestDTO.getP_kindcode(),
					priceRequestDTO.getP_productrankcode(), priceRequestDTO.getP_countrycode(),
					priceRequestDTO.getP_returntype());

			// "평균" 데이터만 필터링
			List<PriceDataDTO> filteredPriceDataList = apiService.filterByCountynameRetailAverage(priceDataList);

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
	
	
	//소매 지역 조회
	@PostMapping("/price/marketname")
	public ResponseEntity<List<PriceDataDTO>> getRetailPriceInfoByMarketname(@RequestBody PriceRequestDTO priceRequestDTO) {
	    try {
	        // ApiService 호출하여 전체 데이터 리스트 얻기
	        List<PriceDataDTO> priceDataList = apiService.getRetailPriceData(
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
	        List<PriceDataDTO> filteredPriceDataList = apiService.filterByMarketnameNotNull(priceDataList);

	        return ResponseEntity.ok(filteredPriceDataList);
	    } catch (Exception e) {
	        return ResponseEntity.status(500).build();
	    }
	}
	
	
	
	
	
}