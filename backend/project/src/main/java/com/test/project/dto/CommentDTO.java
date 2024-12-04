package com.test.project.dto;

import java.time.LocalDateTime;

import com.test.project.entity.CommentEntity;
import com.test.project.entity.HeartEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {

	private Long comId;
	private String content;
	private String userNick;
	private int bodNum;
	private LocalDateTime createDate;
	private LocalDateTime updateDate;
	
	//Entity -> DTO 
		public CommentDTO(CommentEntity entity) {
			this.comId = entity.getComId();
			this.content=entity.getContent();
			this.userNick = entity.getNong().getUserNick();
			this.createDate = entity.getCreateDate();
			this.updateDate =entity.getCreateDate();
			this.bodNum =entity.getBoard().getBodNum();
		}
		
		public static CommentEntity toEntity(CommentDTO dto) {
			
			return CommentEntity.builder()
								.comId(dto.getComId())
								.content(dto.getContent())
								.createDate(dto.getCreateDate())
								.updateDate(dto.getUpdateDate())
								.build();
								

		}
}
