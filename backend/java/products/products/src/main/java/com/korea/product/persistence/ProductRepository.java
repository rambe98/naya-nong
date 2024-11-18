package com.korea.product.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.korea.product.model.ProductEntity;



@Repository
public interface ProductRepository extends JpaRepository<ProductEntity,Integer>{

}
