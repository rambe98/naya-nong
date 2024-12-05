package com.test.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.test.project.entity.ProductEntity;
import com.test.project.service.ProductService;

@RestController
public class ProductController {

	@Autowired
	private ProductService productService;
	
	 // OpenAPI 데이터를 호출하고 DB에 저장하는 엔드포인트
	 @GetMapping("/fetchProductData")
	    public String fetchProductData() {
	        productService.fetchDataAndSave();
	        return "Data fetched and saved to DB!";
	    }

}
