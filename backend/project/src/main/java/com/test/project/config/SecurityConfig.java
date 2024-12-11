package com.test.project.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;

import com.test.project.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;


 
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()

        .cors() // CORS 활성화
        .and()
            .authorizeHttpRequests()
<<<<<<< HEAD
            .requestMatchers("/users/signin", "/users/signup", "/users/**, ","/board", "/board/*", "/heart/**","/api/**", "/api/price/all").permitAll() // 로그인, 회원가입은 모두 허용
=======
            .requestMatchers("/users/signin", "/users/signup", "/users/*, ","/board", "/board/*", "/heart/**","/retail/**","/wholeSale/**").permitAll() // 로그인, 회원가입은 모두 허용
>>>>>>> test
            .anyRequest().authenticated();
         
           

        // JWT 필터 추가
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
