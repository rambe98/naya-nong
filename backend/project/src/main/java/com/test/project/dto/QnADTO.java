package com.test.project.dto;

import java.time.LocalDateTime;

import com.test.project.entity.QnAEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
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