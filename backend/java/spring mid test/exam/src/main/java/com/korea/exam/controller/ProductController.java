package com.korea.exam.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.korea.exam.dto.ProductDTO;
import com.korea.exam.service.ProductService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
	private final ProductService service;
	
	@PostMapping
	public ResponseEntity<?> addProduct(@RequestBody ProductDTO dto){
		ProductDTO products = service.addProduct(dto);
		return ResponseEntity.ok().body(products); 
	}
	
	@GetMapping
	public ResponseEntity<List<ProductDTO>> showAllProducts(){
		List<ProductDTO> products = service.showAllProducts();
		return ResponseEntity.ok(products);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<ProductDTO> showProductsById(@PathVariable Long id) {
	    try {
	        ProductDTO product = service.showProductsById(id);
	        return ResponseEntity.ok(product);
	    } catch (EntityNotFoundException e) {
	        return null;
	    }
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductDTO dto) {
	    List<ProductDTO> u_DTO = service.updateProduct(id, dto);
		if(u_DTO != null) {
			return ResponseEntity.ok().body(u_DTO);
		}
		return ResponseEntity.badRequest().body("업데이트 진행되지 않음");
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
		boolean isDeleted = service.deleteProduct(id);
	    if (isDeleted) {
	        return ResponseEntity.ok("제품 삭제 성공");
	    } else {
	        return ResponseEntity.status(404).body("제품을 찾을 수 없습니다. " + id);
	    }
	}
	
}
