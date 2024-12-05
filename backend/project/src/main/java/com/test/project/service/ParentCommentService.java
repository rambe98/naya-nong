package com.test.project.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.test.project.dto.CommentDTO;
import com.test.project.dto.ParentCommentDTO;
import com.test.project.entity.CommentEntity;
import com.test.project.entity.NongEntity;
import com.test.project.entity.ParentCommentEntity;
import com.test.project.persistence.BoardRepository;
import com.test.project.persistence.CommentRepository;
import com.test.project.persistence.NongRepository;
import com.test.project.persistence.ParentCommentRepository;

@Service
public class ParentCommentService {

	@Autowired
	private ParentCommentRepository parentCommentRepository;
	
	@Autowired
	private CommentRepository commentRepository;
	
	@Autowired
	private NongRepository nongRepository;
	
	//댓글 전체 조회
		public List<ParentCommentDTO> showAllParentComment() {
			return parentCommentRepository.findAll().stream().map(ParentCommentDTO :: new).collect(Collectors.toList());
			
		}

	public ParentCommentDTO addComment(Long comId, String userNick, String content) {
	    // 부모 댓글 찾기
	    Optional<CommentEntity> parentCommentOptional = commentRepository.findByComId(comId);
	    if (!parentCommentOptional.isPresent()) {
	        throw new RuntimeException("부모 댓글을 찾을 수 없습니다.");
	    }

	    CommentEntity parentComment = parentCommentOptional.get();

	    // 사용자 찾기
	    NongEntity user = nongRepository.findByUserNick(userNick)
	            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

	    // 대댓글 엔티티 생성
	    ParentCommentEntity replyComment = ParentCommentEntity.builder()
	            .comment(parentComment)  // 부모 댓글 설정
	            .nong(user)              // 사용자 설정
	            .content(content)        // 대댓글 내용
	            .build();

	    // 대댓글 저장
	    ParentCommentEntity savedReplyComment = parentCommentRepository.save(replyComment);

	    // DTO 반환
	    return new ParentCommentDTO(savedReplyComment);
	}
	
	// 댓글 삭제
	public void deleteComment(Long pComId) {
		ParentCommentEntity comment = parentCommentRepository.findById(pComId)
				.orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
		parentCommentRepository.delete(comment);
	}// deleteComment end
}
