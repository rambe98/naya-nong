package com.test.project.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "boardContext")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int bodNum;
	private String bodTitle;
	@Column(length = 5000)  // 최대 5000자까지 입력 가능
	private String bodDtail;  // 게시글 내용
	
	@ManyToOne
	@JoinColumn(name = "user_nick", referencedColumnName = "userNick", nullable = false)

	private NongEntity project;
	
	@CreationTimestamp
	private LocalDateTime writeDate;
	private LocalDateTime updateDate;
	private int views;
	private int likeCount;
	
	

}
