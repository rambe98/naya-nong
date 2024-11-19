package com.test.project.entity;

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
    //JPA에서 기본 키(id)를 자동으로 생성하는 방법을 정의하는 어노테이션이다.
	//H2와 같은 내장 데이터베이스를 사용하는 경우, 기본적으로 숫자 값이 증가하는 방식으로 ID가 설정된다.
    //예를 들어, 첫 번째 레코드의 ID는 1, 두 번째 레코드는 2, 세 번째 레코드는 3 등으로 순차적으로 증가하는 정수 값이 ID에 들어간다.
    @GeneratedValue(strategy = GenerationType.AUTO)
	private int clientNum;
	private String userId;
	private String userPwd;
	private String userEmail;
	private String userPnum;
	private String userName;
}

