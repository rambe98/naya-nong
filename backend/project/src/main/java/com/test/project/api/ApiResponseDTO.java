package com.test.project.api;

import java.util.List;

import lombok.Data;

@Data
public class ApiResponseDTO {
	  private List<PriceDataDTO> data; // PriceDataDTO 리스트
	    private String status;          // 응답 상태 코드
	    private String message;         // 응답 메시지
}

