package com.korea.product.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
	private int orderId;// 주문 ID
    private int productId;//상품Id
    private String productName;// 상품 이름
    private int productCount;// 주문 개수
    private int productPrice;// 상품 가격
    private int totalPrice;// 총 가격 (주문 개수 * 상품 가격)
    private LocalDateTime orderDate;//주문날짜
    
    public static List<OrderDTO> toListOrderDTO(List<Object[]> list) {
    	return list.stream().map(result -> OrderDTO.builder()
	                .orderId(((int) result[0])) // orderId
	                .productName((String) result[1]) // productName
	                .productCount(((int) result[2]))// productCount
	                .productPrice(((int) result[3]))// productPrice
	                .totalPrice(((int) result[4])) // totalPrice
	                .orderDate(((LocalDateTime) result[5]))// orderDate 변환
	                .build()).collect(Collectors.toList());
    }

}
