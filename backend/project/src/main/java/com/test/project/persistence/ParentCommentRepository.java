package com.test.project.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.test.project.entity.NongEntity;
import com.test.project.entity.ParentCommentEntity;

public interface ParentCommentRepository extends JpaRepository<ParentCommentEntity, Long>{
	
	List<ParentCommentEntity> findByCommentComId(Long comId);

	void deleteByNong(NongEntity nong);

}
