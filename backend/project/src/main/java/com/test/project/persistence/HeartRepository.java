package com.test.project.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.test.project.entity.HeartEntity;
import com.test.project.entity.NongEntity;

@Repository
public interface HeartRepository extends JpaRepository<HeartEntity, Integer> {
	
	// 사용자가 특정 게시글에 대해 좋아요를 눌렀는지 확인
	boolean existsByNong_UserNickAndBoard_BodNum(String userNick, int bodNum);

	// 좋아요를 삭제하는 쿼리
    void deleteByNong_UserNickAndBoard_BodNum(String userNick, int bodNum);
    
    // 해당 게시물에 대한 좋아요 수 계산
    int countByBoard_BodNum(int bodNum);  
    
    // 유저정보 삭제 시 확인
    void deleteByNong(NongEntity nong);
}
