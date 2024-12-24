package com.test.project.dto;

import com.test.project.entity.HeartEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data//Getter,Setter를 쉽게 사용가능
@NoArgsConstructor//기본 생성자를 자동 생성
@AllArgsConstructor//모든 필드를 초기화하는 생성자를 자동으로 만들어줌
@Builder//빌더 패턴을 자동으로 생성
public class HeartDTO {

   private int heartNum;
   private String userNick;
   private int bodNum;
   private String hIkon;
     private int likeCount; // 좋아요 카운트 추가
   
   //Entity -> DTO 
   public HeartDTO(HeartEntity entity) {
      this.heartNum = entity.getHeartNum();
      this.userNick = entity.getNong().getUserNick();
      this.bodNum =entity.getBoard().getBodNum();
      this.hIkon = entity.getHIkon();
   }
   
   public static HeartEntity toEntity(HeartDTO dto) {
      return HeartEntity.builder()
                    .heartNum(dto.getHeartNum())
                    .hIkon(dto.getHIkon()) 
                    .build();
   }
}
