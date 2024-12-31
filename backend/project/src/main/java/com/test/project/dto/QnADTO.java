package com.test.project.dto;

import java.time.LocalDateTime;

import com.test.project.entity.CommentEntity;
import com.test.project.entity.NongEntity;
import com.test.project.entity.ParentCommentEntity;
import com.test.project.entity.QnAEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data//Getter,Setter를 쉽게 사용가능
@NoArgsConstructor//기본 생성자를 자동 생성
@AllArgsConstructor//모든 필드를 초기화하는 생성자를 자동으로 만들어줌
@Builder//빌더 패턴을 자동으로 생성
public class QnADTO {
   private int qnaNum;
   private String qnaTitle;
   private String qnaDtail;
   private String userNick;
   private LocalDateTime writeDate;

   // Entity -> DTO
   public QnADTO(QnAEntity entity) {
      this.qnaNum = entity.getQnaNum();
      this.qnaTitle = entity.getQnaTitle();
      this.qnaDtail = entity.getQnaDtail();
      this.writeDate = entity.getWriteDate();
      this.userNick = entity.getNong().getUserNick();
   }

   // DTO -> Entity
   public static QnAEntity toEntity(QnADTO dto) {
      return QnAEntity.builder()
                    .qnaNum(dto.getQnaNum())
                    .qnaTitle(dto.getQnaTitle())
                    .qnaDtail(dto.getQnaDtail())
                    .writeDate(dto.writeDate)
                    .build();
   }
}