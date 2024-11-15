package com.korea.exam.dto;

import com.korea.exam.model.ProductEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ProductDTO {
	private Long id;
	private Double Price;
	private String name;
	private Integer stock;
	
	public ProductDTO(ProductEntity entity) {
		this.id = entity.getId();
		this.name = entity.getName();
		this.Price = entity.getPrice();
		this.stock = entity.getStock();
	}
	public static ProductEntity toEntity(ProductDTO dto) {
		return ProductEntity.builder()
				.id(dto.getId())
				.price(dto.getPrice())
				.name(dto.getName())
				.stock(dto.getStock())
				.build();
	}
}
