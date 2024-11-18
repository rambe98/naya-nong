package com.korea.product.dto;

import java.time.LocalDateTime;

import com.korea.product.model.ProductEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
	private int id;
	private String name;
    private int inventory;
    private int price;   
    private LocalDateTime adddate;
    private LocalDateTime editdate; 
    // Entity -> DTO 변환
    public ProductDTO(ProductEntity entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        this.inventory = entity.getInventory();
        this.price = entity.getPrice();
        this.adddate = entity.getAdddate();
        this.editdate = entity.getEditdate();
        
    }
    // DTO -> Entity 변환
    public static ProductEntity toEntity(ProductDTO dto) {
        return ProductEntity.builder()
                .id(dto.getId())
                .name(dto.getName())
                .inventory(dto.getInventory())
                .price(dto.getPrice())
                .adddate(dto.getAdddate())
                .editdate(dto.getEditdate())
                .build();
    }
}
