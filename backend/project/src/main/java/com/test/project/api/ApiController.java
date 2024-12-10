package com.test.project.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
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
    public ResponseEntity<Void> getPriceInfo(
            @RequestParam(name = "p_startday") String p_startday,
            @RequestParam(name = "p_endday") String p_endday,
            @RequestParam(name = "p_itemcategorycode") String p_itemcategorycode,
            @RequestParam(name = "p_itemcode") String p_itemcode, 
            @RequestParam(name = "p_kindcode") String p_kindcode,
            @RequestParam(name = "p_productrankcode") String p_productrankcode,
            @RequestParam(name = "p_countrycode") String p_countrycode,
            @RequestParam(name = "p_cert_key") String p_cert_key, 
            @RequestParam(name = "p_cert_id") String p_cert_id,
            @RequestParam(name = "p_returntype") String p_returntype) {

        try {
            // 리다이렉션 URL 구성
            String redirectUrl = "http://www.kamis.or.kr/service/price/xml.do?action=periodRetailProductList"
                    + "&p_startday=" + p_startday
                    + "&p_endday=" + p_endday
                    + "&p_itemcategorycode=" + p_itemcategorycode
                    + "&p_itemcode=" + p_itemcode
                    + "&p_kindcode=" + p_kindcode
                    + "&p_productrankcode=" + p_productrankcode
                    + "&p_countrycode=" + p_countrycode
                    + "&p_cert_key=" + p_cert_key
                    + "&p_cert_id=" + p_cert_id
                    + "&p_returntype=" + p_returntype;

            // 리다이렉션 처리
            HttpHeaders headers = new HttpHeaders();
            headers.add("Location", redirectUrl);

            return ResponseEntity.status(302).headers(headers).build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
