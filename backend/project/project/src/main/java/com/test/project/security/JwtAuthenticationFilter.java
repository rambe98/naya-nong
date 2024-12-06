package com.test.project.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
//OncePerRequestFilter 상속받기
public class JwtAuthenticationFilter extends OncePerRequestFilter{

	@Autowired
	private TokenProvider tokenProvider;
	
	//doFilterInternal을 오버라이딩해야 클래스에 에러가 사라짐
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		try {
			// 요청에서 토큰을 가져옵니다
			String token = parseBearerToken(request);
			log.info("Filter is running...");

			if (token != null && !token.equalsIgnoreCase("null")) {
				// 토큰을 검증합니다
				log.info("Token found: " + token);  // 토큰 값 로깅
				String userId = tokenProvider.validateAndGetUserId(token);
				log.info("Authenticated user ID : " + userId);

				// 인증된 사용자 정보를 SecurityContext에 설정합니다
				AbstractAuthenticationToken authentication = 
					new UsernamePasswordAuthenticationToken(userId, null, AuthorityUtils.NO_AUTHORITIES);
				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
				securityContext.setAuthentication(authentication);
				SecurityContextHolder.setContext(securityContext);
			}
		} catch (Exception e) {
			logger.error("Could not set user authentication in security context", e);
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 토큰이 잘못되었을 경우 401 응답
			response.getWriter().write("Unauthorized access");
			return;
		}

		filterChain.doFilter(request, response); // 다음 필터로 넘깁니다
	}
	//HttpsServletRequest request
	//클라이언트가 하는 요청은 request 객체에 담긴다.
	private String parseBearerToken(HttpServletRequest request) {
		//Http 요청의 헤더를 파싱해 Bearer 토큰을 반환한다.
		String bearerToken = request.getHeader("Authorization");//Authorization부분만 잘라낸다  
		
		//Bearer 토큰 형식일 경우 토큰값만 반환
		if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}
		return null;
	}
  
}
