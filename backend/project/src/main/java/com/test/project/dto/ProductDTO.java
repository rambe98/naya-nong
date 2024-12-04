package com.test.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.test.project.entity.ProductEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class ProductDTO {
    private String pCertKey;
    private String pCertId;
    private String pReturnType;
    private String price;

    // Getters and Setters
    public String getpCertKey() {
        return pCertKey;
    }

    public void setpCertKey(String pCertKey) {
        this.pCertKey = pCertKey;
    }

    public String getpCertId() {
        return pCertId;
    }

    public void setpCertId(String pCertId) {
        this.pCertId = pCertId;
    }

    public String getpReturnType() {
        return pReturnType;
    }

    public void setpReturnType(String pReturnType) {
        this.pReturnType = pReturnType;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    // DTO -> Entity 변환
    public ProductEntity toEntity() {
        ProductEntity productEntity = new ProductEntity();
        productEntity.setPCertKey(this.pCertKey);
        productEntity.setPCertId(this.pCertId);
        productEntity.setPReturnType(this.pReturnType);
        productEntity.setPrice(this.price);
        return productEntity;
    }
}
