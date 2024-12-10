package com.test.project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.test.project.dto.HeartDTO;
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
    public int updateAndGetLikeCount(int bodNum) {
        // 해당 게시물에 대한 좋아요 수 조회
        int likeCount = heartRepository.countByBoard_BodNum(bodNum);
        // 게시물 조회
        BoardEntity boardEntity = boardRepository.findById(bodNum)
                .orElseThrow(() -> new IllegalArgumentException("게시물을 찾을 수 없습니다."));
        // 좋아요 수 갱신
        boardEntity.setLikeCount(likeCount);
        // 갱신된 게시물 저장
        boardRepository.save(boardEntity);
        // 갱신된 좋아요 수 반환
        return boardEntity.getLikeCount();
    }//updateAndGetLikeCount end
	
	
	@Transactional
	public boolean likeBoard(String userNick,int bodNum) {
		boolean alreadyHearted = heartRepository.existsByNong_UserNickAndBoard_BodNum(userNick, bodNum);
		if(alreadyHearted) {
			heartRepository.deleteByNong_UserNickAndBoard_BodNum(userNick, bodNum);
			return false;
		}
		BoardEntity boardEntity = boardRepository.findById(bodNum)
				 .orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다."));
	    NongEntity userEntity = nongRepository.findByUserNick(userNick)
	            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
	    // 좋아요 엔티티 저장
	    HeartEntity heartEntity = new HeartEntity();
	    heartEntity.setNong(userEntity);  // 사용자 정보 설정
	    heartEntity.setBoard(boardEntity);  // 게시판 정보 설정
	    heartEntity.setHIkon("좋아요 추가");
	    heartRepository.save(heartEntity);  // HeartRepository를 사용하여 저장
	    updateAndGetLikeCount(bodNum);  // 좋아요 수 갱신
	    return true;  // 좋아요가 추가되었음을 반환
	}
}
