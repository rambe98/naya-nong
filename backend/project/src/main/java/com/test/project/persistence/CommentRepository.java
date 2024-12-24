package com.test.project.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.test.project.entity.CommentEntity;
import com.test.project.entity.NongEntity;

public interface CommentRepository extends JpaRepository<CommentEntity,Long>{

	//bodNum에 들어간 댓글을 List형식으로 받아옴
	List<CommentEntity> findByBoardBodNum(int bodNum);
	
	//comId를 찾고 Optional 타입으로 반환
	Optional<CommentEntity> findByComId(Long comId);
	
	//userNick이 삭제 됐는지 확인 반환타입 void
	void deleteByNong(NongEntity userEntity);
}
