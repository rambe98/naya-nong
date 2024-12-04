package com.test.project.dto;

import java.time.LocalDateTime;

import com.test.project.entity.BoardEntity;
import com.test.project.entity.NongEntity;

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
	private LocalDateTime updateDate;
	private int views;
	private int likeCount;
	
	
	//Entity -> DTO
	public BoardDTO(BoardEntity entity) {
		
		this.bodNum = entity.getBodNum();
		this.bodTitle = entity.getBodTitle();
		this.bodDtail = entity.getBodDtail();
		this.writeDate = entity.getWriteDate();
		this.views = entity.getViews();
		this.updateDate = entity.getUpdateDate();
		this.likeCount = entity.getLikeCount();
		this.userNick = entity.getProject().getUserNick();

	}
	
	//DTO -> Entity
	public static BoardEntity toEntity(BoardDTO dto) {
		
		
		return BoardEntity.builder()
						  .bodNum(dto.getBodNum())
						  .bodTitle(dto.getBodTitle())
						  .bodDtail(dto.getBodDtail())
						  .writeDate(dto.writeDate)
						  .updateDate(dto.getUpdateDate())
						  .views(dto.views)
						  .likeCount(dto.getLikeCount())
						  .build();
	}
	

}
