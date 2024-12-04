package com.test.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.test.project.entity.ProductEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {

	 // @JsonProperty로 API 응답 필드명과 객체의 필드명을 매핑
    @JsonProperty("p_startday")
    private String pStartday;       // 시작일

    @JsonProperty("p_endday")
    private String pEndday;         // 종료일

    @JsonProperty("p_productclscode")
    private String pProductClsCode; // 제품 분류 코드

    @JsonProperty("p_itemcategorycode")
    private String pItemCategoryCode; // 아이템 카테고리 코드

    @JsonProperty("p_itemcode")
    private String pItemCode;        // 아이템 코드

    @JsonProperty("p_countrycode")
    private String pCountryCode;     // 국가 코드

    // Entity -> DTO 변환 메서드
    public static ProductDTO fromEntity(ProductEntity entity) {
        if (entity == null) {
            return null;
        }
        return new ProductDTO(
                entity.getPCountryCode(),
                entity.getPEndday(),
                entity.getPProductClsCode(),
                entity.getPItemCategoryCode(),
                entity.getPItemCode(),
                entity.getPCountryCode()
        );
    }

    // DTO -> Entity 변환 메서드
    public ProductEntity toEntity() {
        ProductEntity product = new ProductEntity();
        product.setPStartday(this.pStartday);
        product.setPEndday(this.pEndday);
        product.setPProductClsCode(this.pProductClsCode);
        product.setPItemCategoryCode(this.pItemCategoryCode);
        product.setPItemCode(this.pItemCode);
        product.setPCountryCode(this.pCountryCode);
        return product;
    }
    
    
}
