package com.test.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import com.test.project.dto.ProductDTO;

import lombok.Data;

@Configuration // 스프링 설정 클래스 loC컨테이너에 Bean을 등록하는 역할
public class AppConfig {

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate(); // RestTemplate을 Spring IoC 컨테이너에 Bean으로 등록
	}
}
