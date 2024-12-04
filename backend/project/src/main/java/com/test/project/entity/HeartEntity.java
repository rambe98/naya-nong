package com.test.project.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeartEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int heartNum;
	
	@ManyToOne
	@JoinColumn(name = "userNick", referencedColumnName = "userNick")
    private NongEntity nong;
	
	@ManyToOne
	@JoinColumn(name = "bodNum", referencedColumnName = "bodNum")
    private BoardEntity board;
	
}
