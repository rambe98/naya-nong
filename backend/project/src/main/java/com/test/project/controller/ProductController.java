package com.test.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.test.project.dto.ProductDTO;
import com.test.project.entity.ProductEntity;
import com.test.project.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/product")
public class ProductController {

	private final ProductService productService;

	@Autowired
	public ProductController(ProductService productService) {
		this.productService = productService;
	}

    // 제품 데이터를 가져오고 DB에 저장하는 엔드포인트
    @GetMapping("/product/fetch-and-save")
    public ProductDTO fetchAndSaveProduct(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("productClsCode") String productClsCode,
            @RequestParam("itemCategoryCode") String itemCategoryCode,
            @RequestParam("itemCode") String itemCode,
            @RequestParam("kindCode") String kindCode,
            @RequestParam("productRankCode") String productRankCode,
            @RequestParam("countryCode") String countryCode,
            @RequestParam("convertKgYn") String convertKgYn,
            @RequestParam("certKey") String certKey,
            @RequestParam("certId") String certId,
            @RequestParam("returnType") String returnType,
            @RequestParam("apiKey") String apiKey
            
    )  {
    	return productService.fetchAndSaveProduct(
            startDate, endDate, productClsCode, itemCategoryCode, 
            itemCode, kindCode, productRankCode, countryCode, 
            convertKgYn, certKey, certId, returnType
            );
    }
}
