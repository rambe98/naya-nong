package com.korea.product.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.korea.product.model.OrderEntity;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Integer> {

   @Query("SELECT o.orderId," 
            +"o.product.name," 
            +"o.productCount,"
            +"o.product.price," 
            +"(o.productCount * o.product.price) AS totalPrice, "
            +"o.orderDate "
            +"FROM OrderEntity o")
      List<Object[]> findAllOrderTotalPrices();

}