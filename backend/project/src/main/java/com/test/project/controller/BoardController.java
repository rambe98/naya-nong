package com.test.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.test.project.dto.BoardDTO;
import com.test.project.service.BoardService; 

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class BoardController {

	@Autowired
	private BoardService service;
	
	@GetMapping
	public ResponseEntity<List<BoardDTO>> showAllBoard(){
		List<BoardDTO> products = service.showAllBoard();
		return ResponseEntity.ok(products);
	}//showAllBoard end
	
	
	@PostMapping
	public ResponseEntity<?> addBoard(@RequestBody BoardDTO dto){
		BoardDTO users = service.addBoard(dto);
		return ResponseEntity.ok().body(users); 
	}//addBoard end
	
	
	@PutMapping
	public ResponseEntity<List<BoardDTO>> updateBoard(@RequestBody BoardDTO dto){
	      
	     List<BoardDTO> users = service.updateBoard(dto);
	      
	      return ResponseEntity.ok().body(users);
	   }//updateUsers end

	
	@DeleteMapping("/{clientNum}")
	public ResponseEntity<?> deleteBoard(BoardDTO dto){
	      
	      boolean isDeleted = service.deleteBoard(dto);
	      try {
	         if(isDeleted) {
	            return ResponseEntity.ok("회원이 탈퇴되었습니다.");
	         }else {
	            return ResponseEntity.status(404).body("회원정보를 찾을 수 없습니다.");
	         }
	         
	      } catch (Exception e) {
	         return ResponseEntity.badRequest().body("데이터에러");
	      }//catch end
}//deleteUsers end
	
	
}











