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

import com.test.project.dto.CommentDTO;
import com.test.project.entity.CommentEntity;
import com.test.project.service.CommentService;

@RestController
@RequestMapping("/comments")
public class CommentController {
	
	@Autowired
	private CommentService commentService;
	
	@GetMapping
	public ResponseEntity<List<CommentDTO>> showAllComment(){
		List<CommentDTO> comment =  commentService.showAllComment();
		return ResponseEntity.ok(comment);
	}

	 // 댓글 추가 API
    @PostMapping("/add")
    public ResponseEntity<?> addComment(@RequestBody CommentDTO dto) {
    	
    	int bodNum = dto.getBodNum();
    	String userNick = dto.getUserNick();
    	String content = dto.getContent();
    	CommentDTO responseDTO = commentService.addComment(bodNum, userNick, content);
        return ResponseEntity.ok(responseDTO);  // 성공적으로 댓글을 추가하고, 생성된 댓글 정보를 반환
    }
    

    @PutMapping("/update/{comId}")
    public ResponseEntity<CommentDTO> updateComment(@PathVariable("comId") Long comId, @RequestBody CommentDTO dto) {

        CommentDTO updatedComment = commentService.updateComment(comId, dto.getContent());

        return ResponseEntity.ok(updatedComment); // 수정된 댓글을 반환
    }
    
    @DeleteMapping("/delete/{comId}")
    public ResponseEntity<String> deleteComment(@PathVariable("comId") Long comId) {
        commentService.deleteComment(comId);
        return ResponseEntity.ok("삭제 완료");
    }    
}
