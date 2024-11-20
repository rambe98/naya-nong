package com.test.project.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

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
@Table(name = "boardContext")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int bodNum;
	private String bodTitle;
	private String bodDtail;
	
	@ManyToOne
	@JoinColumn(name="userNick", nullable = false)
	private String userNick;
	
	@CreationTimestamp
	private LocalDateTime writeDate;
	private int views;
	private int like;
	
	

}
