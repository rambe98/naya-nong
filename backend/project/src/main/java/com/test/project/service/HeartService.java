package com.test.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.test.project.entity.BoardEntity;
import com.test.project.entity.HeartEntity;
import com.test.project.entity.NongEntity;
import com.test.project.persistence.BoardRepository;
import com.test.project.persistence.HeartRepository;
import com.test.project.persistence.NongRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HeartService {

	
	@Autowired
	private HeartRepository heartRepository;
	
	@Autowired
	private NongRepository nongRepository;
	
	@Autowired
	private BoardRepository boardRepository;
	
	
	@Transactional
	public boolean likeBoard(String userNick,int bodNum) {
		
		boolean alreadyHearted = heartRepository.existsByNong_UserNickAndBoard_BodNum(userNick, bodNum);
		
		if(alreadyHearted) {
			heartRepository.deleteByNong_UserNickAndBoard_BodNum(userNick, bodNum);
			return false;
		}
		
		BoardEntity boardEntity = boardRepository.findById(bodNum)
				 .orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다."));
		
		// 사용자가 존재하는지 확인
	    NongEntity userEntity = nongRepository.findByUserNick(userNick)
	            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
	    
	    
	 // 좋아요 엔티티 생성
	    HeartEntity heartEntity = new HeartEntity();
	    heartEntity.setNong(userEntity);  // 사용자 정보 설정
	    heartEntity.setBoard(boardEntity);  // 게시판 정보 설정
	    
	    // 좋아요 엔티티 저장
	    heartRepository.save(heartEntity);
	    return true;
	}
}
