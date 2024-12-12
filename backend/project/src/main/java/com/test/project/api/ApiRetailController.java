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
	@PostMapping("/price/item")
	public ResponseEntity<List<PriceDataDTO>> getRetailPriceInfoByItem(@RequestBody PriceRequestDTO priceRequestDTO) {
	    try {
	        List<PriceDataDTO> priceDataList = apiService.getRetailPriceInfo(
	            "감자",  // 사용자가 입력한 품목 이름
	            priceRequestDTO.getP_startday(),
	            priceRequestDTO.getP_endday(),
	            priceRequestDTO.getP_countrycode(),
	            priceRequestDTO.getP_returntype()
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