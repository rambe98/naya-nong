package com.test.project.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.test.project.entity.NongEntity;

@Repository
public interface NongRepository extends JpaRepository<NongEntity,Integer>{

}
