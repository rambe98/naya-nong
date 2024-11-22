package com.test.project.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.test.project.entity.NongEntity;

@Repository
public interface NongRepository extends JpaRepository<NongEntity,Integer>{

	// 'userNick'을 기준으로 NongEntity를 찾는 메서드 정의
    Optional<NongEntity> findByUserNick(String userNick);
    Optional<NongEntity> findByClientNum(int clientNum);
}
