package com.test.project.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.test.project.entity.NongEntity;

@Repository
public interface NongRepository extends JpaRepository<NongEntity, Integer> {
	// 'userNick'을 기준으로 NongEntity를 찾는 메서드 정의
	Optional<NongEntity> findByUserNick(String userNick);
	Optional<NongEntity> findByUserEmail(String userEmail);
	// 해당 UserNick이 존재하면 true 없으면 false로 바환
	Boolean existsByUserNick(String userNick);

	// 해당 userId이 존재하면 true 없으면 false로 바환
	Boolean existsByUserId(String userId);

	// 해당 userEmail이 존재하면 true 없으면 false로 바환
	Boolean existsByUserEmail(String userEmail);

	Optional<NongEntity> findByUserId(String userId);

	// userId와 userPwd를 기준으로 UserEntity를 조회하는 메서드
	Optional<NongEntity> findByUserIdAndUserPwd(String userId, String userPwd);

	// clientNum과 userPwd 기준으로 UserEntity를 조회하는 메서드
	Optional<NongEntity> findByClientNumAndUserPwd(int clientNum, String userPwd);
	
	// 유저 아이디와 이메일을 찾는 메서드
	Optional<NongEntity> findByUserIdAndUserEmail(String userId, String email);

}
