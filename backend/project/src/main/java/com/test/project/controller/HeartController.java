package com.test.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.test.project.dto.HeartDTO;
import com.test.project.service.HeartService;

@RestController
@RequestMapping("/heart")
public class HeartController {

	@Autowired
	private HeartService service;

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
	}

}
