package com.test.project.dto;

import com.test.project.entity.HeartEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HeartDTO {

	private int heartNum;
	private String userNick;
	private int bodNum;
	
	
	
	//Entity -> DTO 
	public HeartDTO(HeartEntity entity) {
		this.heartNum = entity.getHeartNum();
		this.userNick = entity.getNong().getUserNick();
		this.bodNum =entity.getBoard().getBodNum();
	}
	
	public static HeartEntity toEntity(HeartDTO dto) {
		
		return HeartEntity.builder()
						  .heartNum(dto.getHeartNum())
						  .build();
	}
}
