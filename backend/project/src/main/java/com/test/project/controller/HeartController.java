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
	
	 @PostMapping("/{bodNum}/heart")
	    public ResponseEntity<?> likePost(@RequestBody HeartDTO dto) {
		 
		 String userNick = dto.getUserNick();
		 int bodNum = dto.getBodNum();
		 
		 
	        try {
	            service.likeBoard(userNick, bodNum);
	            return ResponseEntity.ok("좋아요가 눌렸습니다.");
	        } catch (IllegalArgumentException e) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
	        }
	    }

}
