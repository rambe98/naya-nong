package com.test.project.dto;

import java.time.LocalDateTime;

import com.test.project.entity.CommentEntity;
import com.test.project.entity.ParentCommentEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
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
