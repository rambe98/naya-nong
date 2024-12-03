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
      BoardEntity getBoardsByBoardNum = service.getBoardsByBoardNum(bodNum);
      return ResponseEntity.ok(getBoardsByBoardNum);
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
