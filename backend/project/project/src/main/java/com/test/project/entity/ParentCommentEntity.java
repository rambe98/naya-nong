package com.test.project.entity;

import java.time.LocalDateTime;

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
@Table(name = "parentComment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentCommentEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long pComId;

	@ManyToOne
	@JoinColumn(name = "user_nick", referencedColumnName = "userNick", nullable = false)
	private NongEntity nong;

	@ManyToOne
	@JoinColumn(name = "com_id", referencedColumnName = "comId", nullable = false)
	private CommentEntity comment;
	
	private LocalDateTime createDate;

	private String content;
}
