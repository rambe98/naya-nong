package com.test.project.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.test.project.entity.BoardEntity;


@Repository
public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {

	// userNick을 기준으로 게시판을 조회하는 메서드
	 List<BoardEntity> findByProjectUserNick(String userNick);
}
