package com.korea.exam.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.korea.exam.dto.ProductDTO;
import com.korea.exam.model.ProductEntity;
import com.korea.exam.persistence.ProductRepository;


import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {
	private final ProductRepository repository;
	
	public ProductDTO addProduct(ProductDTO productDTO) {
		ProductEntity entity = ProductDTO.toEntity(productDTO);
		return new ProductDTO(repository.save(entity));
	}
	
	public List<ProductDTO> showAllProducts(){
		return repository.findAll().stream().map(ProductDTO::new).collect(Collectors.toList());
	}
	
	public ProductDTO showProductsById(Long id) {
		ProductEntity entity = repository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("해당 제품 아이디는 존재하지 않음 " + id));;
	    return new ProductDTO(entity);
	}
	
	public List<ProductDTO> updateProduct(Long id, ProductDTO dto) {
		Optional<ProductEntity> original = repository.findById(id);
	    if(original.isPresent()){
	        ProductEntity entity = original.get();
	        entity.setName(dto.getName());
	        entity.setPrice(dto.getPrice());
	        repository.save(entity);
	        return Arrays.asList(new ProductDTO(entity));
	    }
	    return null;
	}
	
	public boolean deleteProduct(Long id) {
	    Optional<ProductEntity> Optional = repository.findById(id);
	    if (Optional.isPresent()) {
	        repository.deleteById(id);        
	        return true;
	    } else {
	        return false;
	    }
	}
}
