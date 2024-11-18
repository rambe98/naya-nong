package com.korea.product.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.korea.product.dto.OrderDTO;
import com.korea.product.dto.ProductDTO;
import com.korea.product.model.OrderEntity;
import com.korea.product.model.ProductEntity;
import com.korea.product.persistence.OrderRepository;
import com.korea.product.persistence.ProductRepository;

@Service
public class OrderService {
	@Autowired
    private OrderRepository orderRepository;

	@Autowired
	private ProductRepository productRepository;
	
	//주문내역 조회하기
    public List<OrderDTO> getAllOrderTotalPrices() {
        // JPQL 쿼리로 반환된 List<Object[]> 데이터를 받아옴
        List<Object[]> results = orderRepository.findAllOrderTotalPrices();
        return OrderDTO.toListOrderDTO(results);
    }
    
    public List<ProductDTO> save(OrderDTO dto) {
    	// 상품 존재 여부 확인
    	Optional<ProductEntity> option = productRepository.findById(dto.getProductId());
    	ProductEntity productEntity;
    	if (option.isPresent()) {
            productEntity = option.get();
        }else {
        	throw new IllegalArgumentException("상품을 찾을 수 없음");
        }
    	
        // 재고 확인
    	if (productEntity.getInventory() < dto.getProductCount()) {
            throw new RuntimeException("재고가 부족합니다. 현재 재고: " + productEntity.getInventory());
        }
        // 주문 생성
        OrderEntity order = OrderEntity.builder()
                .product(productEntity)
                .productCount(dto.getProductCount())
                .build();
        //DB에 주문내역 저장하기
        orderRepository.save(order);
    	
        // 재고 감소
        productEntity.setInventory(productEntity.getInventory() - dto.getProductCount());
        //db에 수정된 제고로 업데이트
        productRepository.save(productEntity);
        
        List<ProductDTO> dtos = productRepository.findAll().stream()
        		.map(entity -> new ProductDTO(entity)).collect(Collectors.toList());

        //주문내역 리스트 돌려주기
        return dtos;
    }

}
