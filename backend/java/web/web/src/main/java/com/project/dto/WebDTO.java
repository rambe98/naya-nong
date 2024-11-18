package com.project.dto;

import com.project.web.model.WebEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebDTO {
	
	private int id;
	private Integer userId;
	private String name;
	private String title;
	
	//Entity -> dto
	public WebDTO(WebEntity entity) {
		
		this.id = entity.getId();
		this.userId = entity.getUserId();
		this.name = entity.getName();
		this.title = entity.getTitle();
		
	}
	
	//dtp -> entity
	public static WebEntity toEntity(WebDTO dto) {
		
		return WebEntity.builder()
						.id(dto.getId())
						.userId(dto.getUserId())
						.name(dto.getName())
						.title(dto.getTitle())
						.build();
	}

}
