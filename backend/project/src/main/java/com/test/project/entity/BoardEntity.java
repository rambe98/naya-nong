package com.test.project.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity//해당 클래스는 데이터베이스 테이블에 대응하는 객체
@Table(name = "boardContext")// 테이블 이름 명시
@Data//Getter,Setter 자동생성
@Builder//빌더패턴 사용가능
@NoArgsConstructor//파라미터가 없는 기본 생성자 자동생성
@AllArgsConstructor//모든 필드를 파라미터로 받는 생성자 자동생성
public class BoardEntity {
	
	@Id//엔티티의 기본키 임을 나타냄
	@GeneratedValue(strategy = GenerationType.AUTO)//자동으로 번호 부여
	private int bodNum;
	private String bodTitle;
	@Column(length = 5000)  // 최대 5000자까지 입력 가능
	private String bodDtail;
	
	@ManyToOne//일대다 관계
	@JoinColumn(name = "user_nick",
	referencedColumnName = "userNick",
	nullable = false)//NongEntity와 외래키(user-nick) 설정
	private NongEntity project;
	
	@CreationTimestamp//객체가 생성될 때 자동으로 현재 날짜와 시간이 설정
	private LocalDateTime writeDate;
	
	@UpdateTimestamp//객체가 업데이트 될 때 자동으로 현재 날짜와 시간이 설정
	private LocalDateTime updateDate;
	private int views;
	private int likeCount;
	
	@OneToMany//@OneToMany 일대다 관계 
	(mappedBy = "board",//Board필드와 연관되어 있음을 지정
		cascade = CascadeType.REMOVE,//게시글이 삭제 되면 관련된 댓글도 함께 삭제
		orphanRemoval = true)//게시글 삭제시 해당 댓글이 DB에서 제거
	private List<CommentEntity> comments;
}
