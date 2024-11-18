package com.korea.product.controller;



import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.korea.product.dto.ProductDTO;
import com.korea.product.dto.ResponseDTO;
import com.korea.product.model.ProductEntity;
import com.korea.product.service.ProductService;


import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
	private final ProductService p_service;
	
	//조회하기
	@GetMapping
	public ResponseEntity<?> productList() {
		List<ProductEntity> entities = p_service.findAll();
		List<ProductDTO> dtos = entities.stream().map(ProductDTO::new).collect(Collectors.toList());
		ResponseDTO<ProductDTO> response = ResponseDTO.<ProductDTO>builder().data(dtos).build();
		return ResponseEntity.ok().body(response);
	}
	@PostMapping
	public ResponseEntity<?> createProduct(@RequestBody ProductDTO dto) {
	    try {

	        ProductEntity entity = ProductDTO.toEntity(dto);
	        List<ProductEntity> entities = p_service.create(entity);
	        List<ProductDTO> dtos = entities.stream().map(ProductDTO::new).collect(Collectors.toList());
	        ResponseDTO<ProductDTO> response = ResponseDTO.<ProductDTO>builder().data(dtos).build();
	        return ResponseEntity.ok().body(response);
	    } catch (Exception e) {
	        String error = e.getMessage();
	        ResponseDTO<ProductDTO> response = ResponseDTO.<ProductDTO>builder().error(error).build();
	        return ResponseEntity.badRequest().body(response);
	    }
	}
}
