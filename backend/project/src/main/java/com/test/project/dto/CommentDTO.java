package com.test.project.dto;

import java.time.LocalDateTime;

import com.test.project.entity.CommentEntity;
import com.test.project.entity.HeartEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder//빌더 패턴을 자동으로 생성
@Data//Getter,Setter를 쉽게 사용가능
@NoArgsConstructor//기본 생성자를 자동 생성
@AllArgsConstructor//모든 필드를 초기화하는 생성자를 자동으로 만들어줌
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
			this.updateDate =entity.getUpdateDate();
			this.bodNum =entity.getBoard().getBodNum();
		}
		
		public static CommentEntity toEntity(CommentDTO dto) {
			
			return CommentEntity.builder()
								.comId(dto.getComId())
								.content(dto.getContent())
								.createDate(dto.createDate)
								.updateDate(dto.getUpdateDate())
								.build();
								

		}
}
