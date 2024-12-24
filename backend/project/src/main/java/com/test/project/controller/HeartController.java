package com.test.project.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.test.project.dto.HeartDTO;
import com.test.project.service.HeartService;

@RestController
@RequestMapping("/heart")
public class HeartController {

   @Autowired
   private HeartService service;

   //조회
   @GetMapping("/{bodNum}/likeCount")
   public ResponseEntity<?> getLikeCount(@PathVariable("bodNum") int bodNum, @RequestParam("userNick") String userNick) {
       try {
           // 게시물에 대한 좋아요 수와 사용자가 눌렀는지 여부 가져오기
           HeartDTO heartDTO = service.updateAndGetLikeCountWithUser(bodNum, userNick);
           return ResponseEntity.ok(heartDTO);
       } catch (IllegalArgumentException e) {
           // 예외 발생 시 400 상태 코드로 처리
           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
       } catch (Exception e) {
           // 예기치 못한 오류에 대한 처리
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
       }
   }// getLikeCount end
   

   //추가
   // 좋아요 추가 및 취소
   @PostMapping
   public ResponseEntity<?> likePost(@RequestBody HeartDTO dto) {
       String userNick = dto.getUserNick();
       int bodNum = dto.getBodNum();
       try {
           // 좋아요 상태와 좋아요 수 갱신
           boolean liked = service.likeBoard(userNick, bodNum);
           int likeCount = dto.getLikeCount(); // HeartDTO에서 likeCount 추출
           String hICon = liked ? "filled" : "outline";  // liked 상태에 따라 hIkon 값 설정
           // 반환 값에 상태와 카운트 포함
           return ResponseEntity.ok().body(Map.of(
               "message", liked ? "좋아요가 추가되었습니다." : "좋아요가 취소되었습니다.",
               "liked", liked,  // 좋아요 상태
               "likeCount", likeCount,  // 좋아요 수
               "hICon", hICon  // 좋아요 아이콘 상태
           ));
       } catch (IllegalArgumentException e) {
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
               "message", e.getMessage()
           ));
       }

   }// likePost end

}
