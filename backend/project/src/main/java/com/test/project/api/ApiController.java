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
@RequestMapping("/api")
public class ApiController {

	@Autowired
	private ApiService apiService;
	

<<<<<<< HEAD:backend/project/src/main/java/com/test/project/api/ApiRetailController.java
    // 전체 소매가격 데이터 조회
	@PostMapping("/price/item")
	public ResponseEntity<List<PriceDataDTO>> getRetailPriceInfoByItem(@RequestBody PriceRequestDTO priceRequestDTO) {
	    try {
	        List<PriceDataDTO> priceDataList = apiService.getRetailPriceInfo(
	            "감자",  // 사용자가 입력한 품목 이름
	            priceRequestDTO.getP_startday(),
	            priceRequestDTO.getP_endday(),
	            priceRequestDTO.getP_countrycode(),
	            priceRequestDTO.getP_returntype()
=======
    // 전체 가격 데이터 조회 메서드
    @PostMapping("/price/all")
    public ResponseEntity<List<PriceDataDTO>> getAllPriceInfo(@RequestBody PriceRequestDTO priceRequestDTO) {
        try {
            // ApiService 호출하여 전체 데이터 리스트 얻기
            List<PriceDataDTO> allPriceDataList = apiService.getAllPriceData(
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
    

	@PostMapping("/price")
	public ResponseEntity<List<PriceDataDTO>> getPriceInfo(@RequestBody PriceRequestDTO priceRequestDTO) {
		try {
			// ApiService 호출하여 원본 데이터 리스트 얻기
			List<PriceDataDTO> priceDataList = apiService.getPriceData(priceRequestDTO.getP_startday(),
					priceRequestDTO.getP_endday(), priceRequestDTO.getP_itemcategorycode(),
					priceRequestDTO.getP_itemcode(), priceRequestDTO.getP_kindcode(),
					priceRequestDTO.getP_productrankcode(), priceRequestDTO.getP_countrycode(),
					priceRequestDTO.getP_returntype());

			// "평균" 데이터만 필터링
			List<PriceDataDTO> filteredPriceDataList = apiService.filterByCountynameAverage(priceDataList);

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
	
	@PostMapping("/price/marketname")
	public ResponseEntity<List<PriceDataDTO>> getPriceInfoByMarketname(@RequestBody PriceRequestDTO priceRequestDTO) {
	    try {
	        // ApiService 호출하여 전체 데이터 리스트 얻기
	        List<PriceDataDTO> priceDataList = apiService.getPriceData(
	                priceRequestDTO.getP_startday(),
	                priceRequestDTO.getP_endday(),
	                priceRequestDTO.getP_itemcategorycode(),
	                priceRequestDTO.getP_itemcode(),
	                priceRequestDTO.getP_kindcode(),
	                priceRequestDTO.getP_productrankcode(),
	                priceRequestDTO.getP_countrycode(),
	                priceRequestDTO.getP_returntype()
>>>>>>> parent of 425bfef (open API modification):backend/project/src/main/java/com/test/project/api/ApiController.java
	        );

	        if (priceDataList.isEmpty()) {
	            return ResponseEntity.noContent().build();  // 데이터가 없으면 204 상태 코드 반환
	        }

	        return ResponseEntity.ok(priceDataList);  // 데이터가 있으면 200 상태 코드로 반환
	    } catch (Exception e) {
	        return ResponseEntity.status(500).build();  // 예외 발생 시 500 상태 코드 반환
	    }
	}
    
 

	
	
}