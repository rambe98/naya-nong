package com.test.project.dto;

import java.time.LocalDateTime;

import com.test.project.entity.CommentEntity;
import com.test.project.entity.ParentCommentEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder//빌더 패턴을 자동으로 생성
@Data//Getter,Setter를 쉽게 사용가능
@NoArgsConstructor//기본 생성자를 자동 생성
@AllArgsConstructor//모든 필드를 초기화하는 생성자를 자동으로 만들어줌
public class ParentCommentDTO {
	
	private Long pComId;
	private String content;
	private Long comId;
	private String userNick;
	private LocalDateTime createDate;
	

	//Entity -> DTO 
		public ParentCommentDTO(ParentCommentEntity entity) {
			this.pComId = entity.getPComId();
			this.content = entity.getContent();
			this.userNick = entity.getNong().getUserNick();
			this.comId = entity.getComment().getComId();
			this.createDate = entity.getCreateDate();
		}
}
