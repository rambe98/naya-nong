package com.test.project.dto;

import java.time.LocalDateTime;

import com.test.project.entity.BoardEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardDTO {
	
	private int bodNum;
	private String bodTitle;
	private String bodDtail;
	private String userNick;
	private LocalDateTime writeDate;
	private int views;
	private int like;
	
	
	//Entity -> DTO
	public BoardDTO(BoardEntity entity) {
		
		this.bodNum = entity.getBodNum();
		this.bodTitle = entity.getBodTitle();
		this.bodDtail = entity.getBodDtail();
		this.writeDate = entity.getWriteDate();
		this.views = entity.getViews();
		this.like = entity.getLike();
	}
	
	//DTO -> Entity
	public static BoardEntity toEntity(BoardDTO dto) {
		
		return BoardEntity.builder()
						  .bodNum(dto.getBodNum())
						  .bodTitle(dto.getBodTitle())
						  .bodDtail(dto.getBodDtail())
						  .writeDate(dto.writeDate)
						  .views(dto.views)
						  .like(dto.getLike())
						  .build();
	}
	

}
