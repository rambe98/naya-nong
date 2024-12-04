package com.test.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.test.project.dto.BoardDTO;
import com.test.project.entity.BoardEntity;
import com.test.project.service.BoardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {

	@Autowired
	private BoardService service;

	@GetMapping
	public ResponseEntity<List<BoardDTO>> showAllBoard() {
		List<BoardDTO> boards = service.showAllBoard();
		return ResponseEntity.ok(boards);
	}// showAllBoard end
	

	@GetMapping("/user/{userNick}")
	public ResponseEntity<?> getBoardsByUserNick(@PathVariable("userNick") String userNick) {
		List<BoardDTO> getBoardsByUserNick = service.getBoardsByUserNick(userNick);
		return ResponseEntity.ok(getBoardsByUserNick);
	}//getBoardsByUserNick
	
	@GetMapping("/{bodNum}")
	public ResponseEntity<?> getBoardsByBoardNum(@PathVariable("bodNum") int bodNum) {
	    try {
	        BoardDTO boardDTO = service.getBoardsByBoardNum(bodNum);
	        return ResponseEntity.ok(boardDTO); // 게시글 정보 반환
	    } catch (RuntimeException e) {
	        return ResponseEntity.status(404).body(e.getMessage()); // 게시글이 없을 경우 404 상태 코드 반환
	    } catch (Exception e) {
	        return ResponseEntity.status(500).body("서버 오류가 발생했습니다."); // 다른 예외 처리
	    }
	}
	// 제목으로 검색
    @GetMapping("/search/title")
    public ResponseEntity<List<BoardDTO>> searchByTitle(@RequestParam("keyword") String titleKeyword) {
        List<BoardDTO> boards = service.searchByTitle(titleKeyword);
        return ResponseEntity.ok(boards);
    }

    // 내용으로 검색
    @GetMapping("/search/content")
    public ResponseEntity<List<BoardDTO>> searchByContent(@RequestParam("keyword") String contentKeyword) {
        List<BoardDTO> boards = service.searchByContent(contentKeyword);
        return ResponseEntity.ok(boards);
    }

    // 닉네임으로 검색
    @GetMapping("/search/userNick")
    public ResponseEntity<List<BoardDTO>> searchByUserNick(@RequestParam("keyword") String userNickKeyword) {
        List<BoardDTO> boards = service.searchByUserNick(userNickKeyword);
        return ResponseEntity.ok(boards);
    }
    // 제목과 내용으로 검색
    @GetMapping("/search/titleAndContent")
    public ResponseEntity<List<BoardDTO>> searchByTitleAndContent(@RequestParam("titleKeyword") String titleKeyword,
                                                                  @RequestParam("contentKeyword") String contentKeyword) {
        List<BoardDTO> boards = service.searchByTitleAndContent(titleKeyword, contentKeyword);
        return ResponseEntity.ok(boards);
    }

    // 전체 검색 (제목, 내용, 닉네임)
    @GetMapping("/search/all")
    public ResponseEntity<List<BoardDTO>> searchAll(@RequestParam("keyword") String keyword) {
        List<BoardDTO> boards = service.searchAll(keyword);
        return ResponseEntity.ok(boards);
    }
	
	@PostMapping
	public ResponseEntity<?> addBoard(@RequestBody BoardDTO dto) {
		BoardDTO addBoard = service.addBoard(dto);
		return ResponseEntity.ok().body(addBoard);
	}// addBoard end

	@PutMapping("/{bodNum}")
	public ResponseEntity<?> updateBoard(@RequestBody BoardDTO dto) {
		BoardDTO updateBoard = service.updateBoard(dto);
		return ResponseEntity.ok().body(updateBoard);
	}// updateUsers end
	

	@DeleteMapping("/{bodNum}")
	public ResponseEntity<?> deleteBoard(BoardDTO dto) {
		boolean isDeleted = service.deleteBoard(dto);
		try {
			if (isDeleted) {
				return ResponseEntity.ok("게시글이 삭제 되었습니다.");
			} else {
				return ResponseEntity.status(404).body("게시글을 찾을 수 없습니다.");
			}
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("데이터에러");
		} // catch end
	}// deleteUsers end
	
	

}
