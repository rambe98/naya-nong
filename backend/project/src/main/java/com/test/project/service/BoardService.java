package com.test.project.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.test.project.dto.BoardDTO;
import com.test.project.entity.BoardEntity;
import com.test.project.entity.HeartEntity;
import com.test.project.entity.NongEntity;
import com.test.project.persistence.BoardRepository;
import com.test.project.persistence.HeartRepository;
import com.test.project.persistence.NongRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardService {

	@Autowired
	private BoardRepository boardRepository;

	@Autowired
	private NongRepository nongRepository;

	@Autowired
	private HeartRepository heartRepository;

	private void validate(final BoardEntity entity) {
		if (entity == null) {
			throw new RuntimeException("Entity cannot be null.");
		}
	}// validate end

	// 조회
	public List<BoardDTO> showAllBoard() {
		return boardRepository.findAll().stream().map(BoardDTO::new).collect(Collectors.toList());
	}// showAllBoard end

	// boarderDetail
	public BoardDTO getBoardsByBoardNum(int bodNum) {
		// 게시글 조회
		BoardEntity boardEntity = boardRepository.findById(bodNum)
				.orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다. id: " + bodNum));

		// 조회수 증가
		boardEntity.setViews(boardEntity.getViews() + 1); // 조회수 1 증가
		boardRepository.save(boardEntity); // 업데이트된 게시글 저장

		// BoardDTO로 변환하여 반환
		return new BoardDTO(boardEntity);
	}

	// 사용자별게시판 조회
	public List<BoardDTO> getBoardsByUserNick(String userNick) {
		// BoardEntity에서 userNick에 해당하는 게시판 리스트를 조회
		List<BoardEntity> boardEntities = boardRepository.findByProjectUserNick(userNick);
		// 조회된 BoardEntity 리스트를 BoardDTO 리스트로 변환하여 반환
		return boardEntities.stream().map(BoardDTO::new).collect(Collectors.toList());
	}// getBoardsByUserNick end

	// 제목으로 게시글 검색
	public List<BoardDTO> searchByTitle(String titleKeyword) {
		List<BoardEntity> boardEntities = boardRepository.findByBodTitleContaining(titleKeyword);
		return boardEntities.stream().map(BoardDTO::new).collect(Collectors.toList());
	}

	// 내용으로 게시글 검색
	public List<BoardDTO> searchByContent(String contentKeyword) {
		List<BoardEntity> boardEntities = boardRepository.findByBodDtailContaining(contentKeyword);
		return boardEntities.stream().map(BoardDTO::new).collect(Collectors.toList());
	}

	// 제목 또는 내용으로 게시글 검색
	public List<BoardDTO> searchByTitleOrContent(String titleKeyword, String contentKeyword) {
		List<BoardEntity> boardEntities = boardRepository.findByBodTitleContainingOrBodDtailContaining(titleKeyword,
				contentKeyword);
		return boardEntities.stream().map(BoardDTO::new).collect(Collectors.toList());
	}

	// 닉네임으로 게시글 검색
	public List<BoardDTO> searchByUserNick(String userNickKeyword) {
		List<BoardEntity> boardEntities = boardRepository.findByProjectUserNickContaining(userNickKeyword);
		return boardEntities.stream().map(BoardDTO::new).collect(Collectors.toList());
	}

	// 통합 검색
	public List<BoardDTO> searchBoards(String titleKeyword, String contentKeyword, String userNickKeyword) {
		if (titleKeyword != null && contentKeyword != null && userNickKeyword != null) {
			// 제목, 내용, 닉네임에 모두 검색어가 있는 경우
			return boardRepository.findByBodTitleContainingOrBodDtailContaining(titleKeyword, contentKeyword).stream()
					.filter(board -> board.getProject().getUserNick().contains(userNickKeyword)).map(BoardDTO::new)
					.collect(Collectors.toList());
		} else if (titleKeyword != null && contentKeyword == null && userNickKeyword == null) {
			return searchByTitle(titleKeyword);
		} else if (contentKeyword != null && titleKeyword == null && userNickKeyword == null) {
			return searchByContent(contentKeyword);
		} else if (titleKeyword == null && contentKeyword == null && userNickKeyword != null) {
			return searchByUserNick(userNickKeyword);
		} else {
			return searchByTitleOrContent(titleKeyword, contentKeyword);
		}
	}

	// 추가
	@Transactional
	public BoardDTO addBoard(BoardDTO dto) {
		NongEntity userEntity = nongRepository.findByUserNick(dto.getUserNick())
				.orElseThrow(() -> new RuntimeException("User not found"));
		BoardEntity entity = dto.toEntity(dto);
		entity.setProject(userEntity);
		return new BoardDTO(boardRepository.save(entity));
	}// addBoard end

	// 수정
	@Transactional
	public BoardDTO updateBoard(BoardDTO dto) {
		BoardEntity entity = dto.toEntity(dto);
		Optional<BoardEntity> original = boardRepository.findById(entity.getBodNum());
		if (original.isPresent()) {
			BoardEntity board = original.get();
			board.setBodTitle(entity.getBodTitle());
			board.setBodDtail(entity.getBodDtail());
			boardRepository.save(board);
			BoardDTO updatedDTO = new BoardDTO(board);
			return updatedDTO;
		} // if end
		return null;
	}// updateBoard end

	// 삭제
	public boolean deleteBoard(BoardDTO dto) {
		BoardEntity entity = dto.toEntity(dto);
		Optional<BoardEntity> original = boardRepository.findById(entity.getBodNum());
		if (original.isPresent()) {
			boardRepository.delete(entity);
			return true;
		} // if end
		else {
			return false;
		} // else end
	}// deleteUsers end
}
