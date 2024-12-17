package com.test.project.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // 이 클래스를 JPA에서 관리되는 **엔티티(Entity)**로 지정합니다.
@Table(name = "users") //매핑할 데이터베이스 테이블의 이름을 지정합니다.
@Data // 객체 필드의 접근자 메서드와 유틸리티 메서드 작성을 간소화합니다.
@Builder // 빌더 패턴을 자동으로 지원합니다.
// lombok 출처 
@NoArgsConstructor 
// 파라미터가 없는 기본 생성자를 자동으로 생성합니다.
@AllArgsConstructor 
// 클래스의 모든 필드를 매개변수로 받는 생성자를 자동으로 생성합니다.
public class NongEntity {
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	//엔티티의 기본 키 값(@Id)을 자동으로 생성하기 위한 설정입니다.
	private int clientNum;
	private String token;
	private String userId;
	private String userPwd;
	private String userEmail;
	private String userPnum;
	private String userName;
	private String phoneCom;
	private String userNick;
	
	@OneToMany(mappedBy = "nong", 
			cascade = CascadeType.REMOVE, orphanRemoval = true)
	private List<CommentEntity> comments;//CommentEntity와의 관계 추가
	
	@OneToMany(mappedBy = "nong", 
			cascade = CascadeType.REMOVE, orphanRemoval = true)
	private List<QnAEntity> qnas;  // QnAEntity와의 관계 추가
}

