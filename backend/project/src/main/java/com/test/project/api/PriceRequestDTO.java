package com.test.project.api;

import java.time.LocalDateTime;

import com.test.project.dto.ParentCommentDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder//빌더 패턴을 자동으로 생성
@Data//Getter,Setter를 쉽게 사용가능
@NoArgsConstructor//기본 생성자를 자동 생성
@AllArgsConstructor//모든 필드를 초기화하는 생성자를 자동으로 만들어줌
public class PriceRequestDTO  {
	   private String p_startday;
	    private String p_endday;
	    private String p_itemcategorycode;
	    private String p_itemcode;
	    private String p_kindcode;
	    private String p_productrankcode;
	    private String p_countrycode;
	    private String p_returntype;
}
