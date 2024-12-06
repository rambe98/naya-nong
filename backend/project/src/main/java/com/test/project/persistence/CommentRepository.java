package com.test.project.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.test.project.entity.CommentEntity;

public interface CommentRepository extends JpaRepository<CommentEntity,Long>{

	List<CommentEntity> findByBoardBodNum(int bodNum);
	Optional<CommentEntity> findByComId(Long comId);
}
