package com.project.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.web.model.WebEntity;

@Repository
public interface WebRepository extends JpaRepository<WebEntity,Integer>{

}
