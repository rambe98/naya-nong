package com.test.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.test.project.dto.ProductDTO;
import com.test.project.entity.ProductEntity;
import com.test.project.service.ProductService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class ProductController {
	
	private final ProductService productService;
	
	
	 @GetMapping("/product")
	    public ProductDTO getProduct(@RequestParam String url) {
	        // URL을 통해 Open API에서 데이터를 가져옵니다.
	        return productService.getProductFromApi(url);
	    }
}
