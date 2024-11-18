package com.project.web.model;

import com.project.dto.WebDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "web")
public class WebEntity {

	@Id
	private Integer id;
	private Integer userId;
	private String name;
	private String title;
	

	
	
	
}
