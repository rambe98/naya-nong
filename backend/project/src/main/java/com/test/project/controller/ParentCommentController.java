package com.test.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.test.project.dto.CommentDTO;
import com.test.project.dto.ParentCommentDTO;
import com.test.project.service.ParentCommentService;

@RestController
@RequestMapping("/pComment")
public class ParentCommentController {
	
	@Autowired
	ParentCommentService service;
	
	@GetMapping("/{comId}")
	public ResponseEntity<List<ParentCommentDTO>> showAllParentComment(@PathVariable Long comId){
		List<ParentCommentDTO> comment =  service.showAllParentComment(comId);
		return ResponseEntity.ok(comment);
	}
	
	@PostMapping("/addReply/{comId}")
	public ResponseEntity<ParentCommentDTO> addReply(@PathVariable("comId") Long comId, @RequestBody ParentCommentDTO dto){
		ParentCommentDTO savedReply = service.addComment(comId, dto.getUserNick(), dto.getContent());
	    return ResponseEntity.ok(savedReply);
	}
	
	@DeleteMapping("/delete/{pComId}")
	 public ResponseEntity<String> deleteComment(@PathVariable("pComId") Long pComId) {
        service.deleteComment(pComId);
        return ResponseEntity.ok("삭제 완료");
    }    

}
