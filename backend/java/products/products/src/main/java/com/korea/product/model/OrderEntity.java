package com.korea.product.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name="orders")
public class OrderEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int orderId;
	
	@ManyToOne
	@JoinColumn(name = "id", nullable = false)
	private ProductEntity product;
	
	private int productCount;
	
	@CreationTimestamp
	private LocalDateTime orderDate;
	
	
}
