package com.test.project.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.test.project.dto.CommentDTO;
import com.test.project.entity.BoardEntity;
import com.test.project.entity.CommentEntity;
import com.test.project.entity.NongEntity;
import com.test.project.persistence.BoardRepository;
import com.test.project.persistence.CommentRepository;
import com.test.project.persistence.NongRepository;

@Service
public class CommentService {

	@Autowired
	private CommentRepository commentRepository;

	@Autowired
	private NongRepository nongRepository;

	@Autowired
	private BoardRepository boardRepository;
	
	//댓글 전체 조회
	public List<CommentDTO> showAllComment() {
		return commentRepository.findAll().stream().map(CommentDTO :: new).collect(Collectors.toList());
		
	}

	// 댓글 저장
	public CommentDTO addComment(int bodNum, String userNick, String content) {
		BoardEntity board = boardRepository.findByBodNum(bodNum);
		if (board == null) {
			throw new RuntimeException("게시글을 찾을 수 없습니다.");
		}
		NongEntity user = nongRepository.findByUserNick(userNick)
				.orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

		CommentEntity comment = CommentEntity.builder().board(board).nong(user).content(content)
				.createDate(LocalDateTime.now()).build();

		CommentEntity savedComment = commentRepository.save(comment);

		return new CommentDTO(savedComment);
	}//addComent end
	

	// 댓글 수정
	public CommentDTO updateComment(Long comId, String content) {
		// 댓글 조회
		CommentEntity comment = commentRepository.findById(comId)
				.orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

		// 댓글 내용 업데이트
		comment.setContent(content);

		// 수정 날짜 설정
		comment.setUpdateDate(LocalDateTime.now());

		// 댓글 저장
		CommentEntity updatedComment = commentRepository.save(comment);

		// DTO 반환
		return new CommentDTO(updatedComment);
	}// updateComment end
	

	// 댓글 삭제
	public void deleteComment(Long comId) {
		CommentEntity comment = commentRepository.findById(comId)
				.orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
		commentRepository.delete(comment);
	}// deleteComment end

}
