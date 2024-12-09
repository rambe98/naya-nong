package com.test.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.test.project.dto.PriceResponse;

@RestController
public class PriceController {

    // application.yml에서 설정 값을 가져오기
    @Value("${api.url}")
    private String apiUrl;

    @Value("${api.api_key}")
    private String apiKey;

    // 가격 데이터를 조회하는 API 엔드포인트
    @GetMapping("/getPrice")
    public String getPrice(@RequestParam(value = "p_cert_key") String certKey,
                           @RequestParam(value = "p_cert_id") String certId) {

        // p_returntype=json 파라미터를 추가한 URL
        String url = apiUrl + "?action=dailySalesList&p_cert_key=" + certKey + "&p_cert_id=" + certId + "&p_returntype=json";

        RestTemplate restTemplate = new RestTemplate();
        
        // GET 요청을 보내고 응답을 String으로 받기
        ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class);

        // 응답을 문자열로 반환
        return responseEntity.getBody();
    }
}
