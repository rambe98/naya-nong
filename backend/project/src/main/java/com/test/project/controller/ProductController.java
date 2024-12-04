package com.test.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
public class ProductController {

	private final ProductService productService;

	@Autowired
	public ProductController(ProductService productService) {
		this.productService = productService;
	}

	 // 특정 API에서 데이터를 가져와 DB에 저장하는 엔드포인트
	  @GetMapping("/product/fetch-and-save")
	    public ProductEntity fetchAndSave(@RequestParam String endDate) {
	        return productService.fetchAndSaveProduct(endDate);  // endDate를 파라미터로 받아서 처리
	    }
}
