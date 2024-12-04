package com.test.project.entity;

import java.time.LocalDateTime;

import com.test.project.dto.CommentDTO.CommentDTOBuilder;

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
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentEntity {
	
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long comId; // 댓글 ID
	    
	    @ManyToOne
	    @JoinColumn(name = "bodnum", referencedColumnName = "bodNum", nullable = false)
	    private BoardEntity board;
	    
	    @ManyToOne
	    @JoinColumn(name = "userNick", referencedColumnName = "userNick", nullable = false)
	    private NongEntity nong;
	    
	    private String content; 
	    private LocalDateTime createDate;
	    private LocalDateTime updateDate;
}
