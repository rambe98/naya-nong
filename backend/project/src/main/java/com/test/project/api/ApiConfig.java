package com.test.project.api;

import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.util.Timeout;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration//스프링 Bean을 관리하는 어노테이션
public class ApiConfig {

    @Bean//클래스 안에 선언된 메서드에 붙여 해당 메서드가 반환하는 객체를 스프링 컨테이너에 빈으로 등록
    public RestTemplate restTemplate() {
        // //Apache HttpClient의 요청 설정을 위한 RequestConfig를 빌더 패턴으로 생성
        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectTimeout(Timeout.ofSeconds(5))//연결 타임아웃 시간을 5초로 설정
                .setResponseTimeout(Timeout.ofSeconds(5))//응답 타임아웃 시간을 5초로 설정
                .build();

        // HttpClient 생성
        CloseableHttpClient httpClient = HttpClients.custom()
                .setDefaultRequestConfig(requestConfig)// 방금 생성한 requestConfig를 HttpClient의 기본 설정으로 적용
                .build();

        // HttpComponentsClientHttpRequestFactory에 HttpClient 설정
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(httpClient);
        
        return new RestTemplate(factory);
    }
}



