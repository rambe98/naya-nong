package com.test.project.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.test.project.entity.ParentCommentEntity;

public interface ParentCommentRepository extends JpaRepository<ParentCommentEntity, Long>{

}
