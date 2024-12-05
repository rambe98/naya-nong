package com.test.project.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.test.project.entity.ProductEntity;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

}
