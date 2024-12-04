package com.test.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.test.project.dto.HeartDTO;
import com.test.project.entity.BoardEntity;
import com.test.project.persistence.BoardRepository;
import com.test.project.service.HeartService;

@RestController
@RequestMapping("/heart")
public class HeartController {

	@Autowired
	private HeartService service;

	@GetMapping("/{bodNum}/likeCount")
	public ResponseEntity<?> getLikeCount(@PathVariable("bodNum") int bodNum) {
		try {
			// 좋아요 수 갱신하고 반환
			int likeCount = service.updateAndGetLikeCount(bodNum);
			return ResponseEntity.ok(likeCount);
		} catch (IllegalArgumentException e) {
			// 예외 발생 시 400 상태 코드로 처리
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			// 예기치 못한 오류에 대한 처리
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
		}
	}// getLikeCount end
	

	@PostMapping
	public ResponseEntity<?> likePost(@RequestBody HeartDTO dto) {
		String userNick = dto.getUserNick();
		int bodNum = dto.getBodNum();
		try {
			boolean liked = service.likeBoard(userNick, bodNum);
			if (liked) {
				return ResponseEntity.ok("좋아요가 추가되었습니다.");
			} else {
				return ResponseEntity.ok("좋아요가 취소되었습니다.");
			}
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
		}
	}// likePost end

	// 게시물의 좋아요 수를 조회하는 엔드포인트

}
