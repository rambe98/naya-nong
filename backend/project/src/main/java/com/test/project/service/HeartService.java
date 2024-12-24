package com.test.project.service;

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

    // 좋아요 수와 사용자 상태(아이콘 상태) 반환
    @Transactional
    public HeartDTO updateAndGetLikeCountWithUser(int bodNum, String userNick) {
        // 해당 게시물에 대한 좋아요 수 조회
        int likeCount = heartRepository.countByBoard_BodNum(bodNum);

        // 게시물 조회
        BoardEntity boardEntity = boardRepository.findById(bodNum)
                .orElseThrow(() -> new IllegalArgumentException("게시물을 찾을 수 없습니다."));

        // 사용자가 좋아요를 눌렀는지 확인
        boolean isHearted = heartRepository.existsByNong_UserNickAndBoard_BodNum(userNick, bodNum);
        
        // DTO에 필요한 데이터 설정
        HeartDTO heartDTO = new HeartDTO();
        heartDTO.setBodNum(bodNum);
        heartDTO.setUserNick(userNick);
        heartDTO.setHeartNum(0);  // HeartNum은 필요 없으면 0으로 설정
        heartDTO.setHIkon(isHearted ? "filled" : "outline"); // 아이콘 상태 설정 ("filled"는 눌린 상태, "outline"은 기본 상태)

        // 좋아요 수 갱신
        boardEntity.setLikeCount(likeCount);
        // 갱신된 게시물 저장
        boardRepository.save(boardEntity);
        
        heartDTO.setLikeCount(likeCount);  // 좋아요 카운트도 DTO에 설정

        return heartDTO;
    }

    // 좋아요 상태를 확인하고 갱신하는 메서드
    @Transactional
    public boolean likeBoard(String userNick, int bodNum) {
        // 사용자가 해당 게시글에 좋아요를 눌렀는지 확인
        boolean alreadyHearted = heartRepository.existsByNong_UserNickAndBoard_BodNum(userNick, bodNum);

        // 이미 눌렀으면 좋아요를 취소
        if (alreadyHearted) {
            heartRepository.deleteByNong_UserNickAndBoard_BodNum(userNick, bodNum);
            updateAndGetLikeCount(bodNum);  // 좋아요 수 갱신
            return false;  // 좋아요 취소
        }

        // 좋아요를 누르지 않았다면 추가
        BoardEntity boardEntity = boardRepository.findById(bodNum)
                .orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다."));
        NongEntity userEntity = nongRepository.findByUserNick(userNick)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        HeartEntity heartEntity = new HeartEntity();
        heartEntity.setNong(userEntity);  // 사용자 설정
        heartEntity.setBoard(boardEntity);  // 게시판 설정
        heartEntity.setHIkon("filled");  // 좋아요 상태: "filled"
        heartRepository.save(heartEntity);  // 좋아요 엔티티 저장

        updateAndGetLikeCount(bodNum);  // 좋아요 수 갱신
        return true;  // 좋아요 추가
    }

    // 좋아요 수를 갱신하고 반환하는 메서드
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

        return likeCount;  // 좋아요 수 반환
    }
}
