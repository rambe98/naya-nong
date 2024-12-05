package com.test.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.test.project.dto.OpenApiProductDTO;
import com.test.project.entity.ProductEntity;
import com.test.project.persistence.ProductRepository;

@Service
public class ProductService {

	 @Autowired
	    private RestTemplate restTemplate;

	  private final String apiUrl = "http://www.kamis.co.kr/service/price/xml.do?action=dailySalesList&p_cert_key=test&p_cert_id=test&p_returntype=json";
	    @Autowired
	    private ProductRepository productRepository;
	    
	    
	    // OpenAPI에서 데이터를 가져와 DB에 저장하는 메서드
	    public void fetchAndSaveProducts() {
	        // OpenAPI에서 데이터를 가져오기
	        OpenApiProductDTO[] products = restTemplate.getForObject(apiUrl, OpenApiProductDTO[].class);

	        if (products != null) {
	            for (OpenApiProductDTO dto : products) {
	                // DB에 저장
	                ProductEntity product = new ProductEntity();
	                product.setProductNo(dto.getProductNo());
	                product.setCategoryCode(dto.getCategoryCode());
	                product.setProductName(dto.getProductName());

	                productRepository.save(product);  // 제품 데이터 저장
	            }
	        }
	    }
	    
	 // DB에서 모든 제품 조회
	    public Iterable<ProductEntity> getAllProducts() {
	        return productRepository.findAll();
	    }
	    
	    // 특정 품목 조회 (품목코드로 검색)
	    public ProductEntity getProductByProductNo(String productNo) {
	        return productRepository.findByProductNo(productNo);
	    }
}
