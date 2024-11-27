package com.test.project.dto;

import com.test.project.entity.NongEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NongDTO {
   
   private int clientNum;
   private String userId;
   private String userPwd;
   private String userEmail;
   private String userPnum;
   private String userName;
   private String userNick;
   private String phoneCom;
   
   //Entity - > dto
   public NongDTO(NongEntity entity) {
      
      this.clientNum = entity.getClientNum();
      this.userId = entity.getUserId();
      this.userPwd = entity.getUserPwd();
      this.userEmail = entity.getUserEmail();
      this.userPnum = entity.getUserPnum();
      this.userName = entity.getUserName();
      this.userNick = entity.getUserNick();
      this.phoneCom = entity.getPhoneCom();
   }
   //dto -> Entity
   public static NongEntity toEntity(NongDTO dto) {
      
      return NongEntity.builder()
                   .clientNum(dto.getClientNum())
                   .userId(dto.getUserId())
                   .userPwd(dto.getUserPwd())
                   .userEmail(dto.getUserEmail())
                   .userPnum(dto.getUserPnum())
                   .userName(dto.getUserName())
                   .userNick(dto.getUserNick())
                   .phoneCom(dto.getPhoneCom())
                   .build();
   }
}











