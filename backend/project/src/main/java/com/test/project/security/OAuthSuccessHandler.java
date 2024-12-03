package com.test.project.security;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;


//SimpleUrlAuthenticationSuccessHandler
//인증 성공 후 사용자를 처리하는 데 사용되는 클래스

@Slf4j
@Component
@AllArgsConstructor
public class OAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler{
	private static String LOCAL_REDIRECT_URL = "http://localhost:3000";
	
	//토큰을 생성하고,반환하는 기능
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		TokenProvider tokenProvider = new TokenProvider();
		String token = tokenProvider.create(authentication);
		
		//response.getWriter().write(token);
		log.info("token {}",token);
		
		Optional<Cookie> oCookie = Arrays.stream(request.getCookies()).filter(cookie -> cookie.getName().equals("redirecrt-url")).findFirst();

		Optional<String> redirectUri = oCookie.map(Cookie::getValue);
		
		response.sendRedirect(redirectUri.orElseGet(() -> LOCAL_REDIRECT_URL)+ "/socialLogin?token="+token);
	}
}












