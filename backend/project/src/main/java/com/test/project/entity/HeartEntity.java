package com.test.project.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity//DB 테이블과 연관된 JPA 엔티티
@Table(name = "heart")//DB 테이블 이름 지정
@Data//Getter,Setter를 쉽게 사용가능
@NoArgsConstructor//기본 생성자를 자동 생성
@AllArgsConstructor//모든 필드를 초기화하는 생성자를 자동으로 만들어줌
@Builder//빌더 패턴을 자동으로 생성
public class HeartEntity {
   
   @Id
   @GeneratedValue(strategy = GenerationType.AUTO)
   private int heartNum;
   
   @ManyToOne
   @JoinColumn(name = "user_nick", referencedColumnName = "userNick")
    private NongEntity nong;
   
   @ManyToOne
   @JoinColumn(name = "bod_num", referencedColumnName = "bodNum")
    private BoardEntity board;
   private String hIkon;
}
