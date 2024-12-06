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

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NongEntity {
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	private int clientNum;
	private String token;
	private String userId;
	private String userPwd;
	private String userEmail;
	private String userPnum;
	private String userName;
	private String phoneCom;
	private String userNick;
	
	@OneToMany(mappedBy = "nong", cascade = CascadeType.REMOVE, orphanRemoval = true)
	private List<CommentEntity> comments;
	
	@OneToMany(mappedBy = "nong", cascade = CascadeType.REMOVE, orphanRemoval = true)
	private List<QnAEntity> qnas;  // QnAEntity와의 관계 추가
}//NongEntity end

