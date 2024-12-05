package com.test.project.security;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.test.project.entity.NongEntity;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class TokenProvider {
    // SECRET_KEY는 문자열 형태로 간단한 비밀 키로 설정
	private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);  // 비밀 키 생성  // 비밀 키
    // 토큰 생성
    public String create(NongEntity nongEntity) {
        // 기한 지금으로부터 1일로 설정
        Date expiryDate = Date.from(Instant.now().plus(1, ChronoUnit.DAYS));
        // JWT Token 생성
        return Jwts.builder()
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)  // 비밀 키로 서명
                .setSubject(nongEntity.getToken())  // 사용자 ID
                .setIssuer("demo app")  // 발행자 정보
                .setIssuedAt(new Date())  // 발행일
                .setExpiration(expiryDate)  // 만료일
                .compact();  // JWT 생성
    }
    // 토큰 검증 및 사용자 ID 추출
    public String validateAndGetUserId(String token) {
        log.info("Validating token: " + token);  // 토큰 검증 전 로깅
        // JWT 토큰을 파싱하고 서명을 검증하여 Claims 객체를 추출
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)  // 비밀 키 설정
                .build()
                .parseClaimsJws(token)  // JWT 토큰 파싱
                .getBody();  // Claims 객체 반환
        return claims.getSubject();  // 사용자 ID 반환
    }
}
