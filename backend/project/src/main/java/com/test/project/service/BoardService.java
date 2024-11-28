package com.test.project.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.test.project.dto.BoardDTO;
import com.test.project.entity.BoardEntity;
import com.test.project.entity.NongEntity;
import com.test.project.persistence.BoardRepository;
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

	private void validate(final BoardEntity entity) {
		if (entity == null) {
			throw new RuntimeException("Entity cannot be null.");
		}
	}// validate end
	

	// 조회
	public List<BoardDTO> showAllBoard() {
		return boardRepository.findAll().stream().map(BoardDTO::new).collect(Collectors.toList());
	}// showAllBoard end
	

	// 사용자별게시판 조회
	public List<BoardDTO> getBoardsByUserNick(String userNick) {
		// BoardEntity에서 userNick에 해당하는 게시판 리스트를 조회
		List<BoardEntity> boardEntities = boardRepository.findByProjectUserNick(userNick);
		// 조회된 BoardEntity 리스트를 BoardDTO 리스트로 변환하여 반환
		return boardEntities.stream().map(BoardDTO::new).collect(Collectors.toList());
	}// getBoardsByUserNick end
	

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
