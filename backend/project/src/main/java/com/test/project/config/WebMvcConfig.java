package com.test.project.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000/") // 여러 도메인 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
//    
//    @Autowired
//    private JwtAuthenticationFilter jwtAuthenticationFilter;
//    
//    @Autowired
//    private OAuthUserServiceImpl oAuthUserService;
//    
//    @Autowired
//    private OAuthSuccessHandler oAuthSuccessHandler;
//    
//    @Autowired
//    private RedirectUrlCokkieFilter redurectCokkieFilter;
//    
//    @Bean
//    protected DefaultSecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//            .cors().and()  // CORS 설정을 기본적으로 활성화 (추가적인 설정 없이)
//            .csrf().disable()  // CSRF 비활성화
//            .httpBasic().disable()  // HTTP Basic 인증 비활성화
//            .sessionManagement()
//                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // Stateless 세션 관리
//            .and()
//            .authorizeHttpRequests()
//                .requestMatchers("/", "/auth/**", "/oauth2/**").permitAll()  // 인증 없이 접근 허용
//                .anyRequest().authenticated()  // 나머지 요청은 인증 필요
//            .and()
//            .oauth2Login()  // OAuth2 로그인 활성화
//                .redirectionEndpoint()
//                    .baseUri("/oauth2/callback")  // OAuth2 인증 후 리다이렉트할 URI
//                .and()
//                .authorizationEndpoint()
//                    .baseUri("/auth/authorize")  // OAuth2 인증을 시작할 URI
//                .and()
//                .userInfoEndpoint()
//                    .and()  // OAuth2 로그인 후 사용자 정보를 처리하는 서비스는 생략
//                .and()
//            .exceptionHandling()
//                .authenticationEntryPoint(new Http403ForbiddenEntryPoint());  // 인증 실패 시 403 반환
//
//        return http.build();
//    }

}