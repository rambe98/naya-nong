package com.test.project.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
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
@Table(name = "QnA")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QnAEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int qnaNum;
	private String qnaTitle;
	private String qnaDtail;
	
	@ManyToOne
	@JoinColumn(name = "user_nick", referencedColumnName = "userNick")
	private NongEntity nong;
	
	@CreationTimestamp
	private LocalDateTime writeDate;
}