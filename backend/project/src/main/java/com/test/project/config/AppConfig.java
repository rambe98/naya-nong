package com.test.project.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {
	
	 @Bean
	    public RestTemplate restTemplate() {
	        List<HttpMessageConverter<?>> messageConverters = new ArrayList<>();
	        messageConverters.add(new StringHttpMessageConverter()); // text/plain 처리용
	        messageConverters.add(new MappingJackson2HttpMessageConverter()); // JSON 처리용

	        return new RestTemplate(messageConverters);
	    }
}
