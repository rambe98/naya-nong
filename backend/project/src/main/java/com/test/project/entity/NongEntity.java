package com.test.project.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "nayanong")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NongEntity {
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	private int clientNum;
	private String userId;
	private String userPwd;
	private String userEmail;
	private String userPnum;
	private String userName;
	private String phoneCom;
	private String userNick;
	private String authProvider; //OAuth 소셜로그인시 사용할 유저 정보 제공자
}//NongEntity end

