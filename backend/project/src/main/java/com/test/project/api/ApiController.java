package com.test.project.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {

    @Autowired
    private ApiService apiService;

    @GetMapping("/price")
    public ResponseEntity<List<PriceDataDTO>> getPriceInfo(
            @RequestParam(name = "p_startday") String p_startday,
            @RequestParam(name = "p_endday") String p_endday,
            @RequestParam(name = "p_itemcategorycode") String p_itemcategorycode,
            @RequestParam(name = "p_itemcode") String p_itemcode,
            @RequestParam(name = "p_kindcode") String p_kindcode,
            @RequestParam(name = "p_productrankcode") String p_productrankcode,
            @RequestParam(name = "p_countrycode") String p_countrycode,
            @RequestParam(name = "p_returntype", defaultValue = "json") String p_returntype) {

        try {
            // ApiService 호출
            List<PriceDataDTO> priceDataList = apiService.getPriceData(
                    p_startday, p_endday, p_itemcategorycode, p_itemcode,
                    p_kindcode, p_productrankcode, p_countrycode, p_returntype);

            return ResponseEntity.ok(priceDataList);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping("/price/average")
    public ResponseEntity<List<PriceDataDTO>> getPriceInfoAverage(
            @RequestParam(name = "p_startday") String p_startday,
            @RequestParam(name = "p_endday") String p_endday,
            @RequestParam(name = "p_itemcategorycode") String p_itemcategorycode,
            @RequestParam(name = "p_itemcode") String p_itemcode,
            @RequestParam(name = "p_kindcode") String p_kindcode,
            @RequestParam(name = "p_productrankcode") String p_productrankcode,
            @RequestParam(name = "p_countrycode") String p_countrycode,
            @RequestParam(name = "p_returntype", defaultValue = "json") String p_returntype) {

    	 try {
             // ApiService 호출하여 PriceDataDTO 리스트를 가져옵니다.
             List<PriceDataDTO> priceDataList = apiService.getPriceData(
                     p_startday, p_endday, p_itemcategorycode, p_itemcode,
                     p_kindcode, p_productrankcode, p_countrycode, p_returntype);

             // 필터링된 데이터 리스트만 반환
             List<PriceDataDTO> filteredPriceDataList = apiService.filterByAverageCountyName(priceDataList);

             return ResponseEntity.ok(filteredPriceDataList);
         } catch (Exception e) {
             return ResponseEntity.status(500).build();
         }
     }
 }
