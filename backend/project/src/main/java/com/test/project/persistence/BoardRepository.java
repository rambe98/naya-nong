package com.test.project.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.test.project.entity.BoardEntity;


@Repository
public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {
	// userNick을 기준으로 게시판을 조회하는 메서드
	List<BoardEntity> findByProjectUserNick(String userNick);

	BoardEntity findByBodNum(int bodNum);

	// 제목으로 검색
	List<BoardEntity> findByBodTitleContaining(String keyword);

	// 내용으로 검색
	List<BoardEntity> findByBodDtailContaining(String keyword);

	// 닉네임으로 검색
	List<BoardEntity> findByProjectUserNickContaining(String userNickKeyword);
    // 제목 또는 내용에 검색어가 포함된 게시글을 찾는 메서드
    List<BoardEntity> findByBodTitleContainingOrBodDtailContaining(String titleKeyword, String contentKeyword);

    // 제목, 내용, 작성자 닉네임을 포함한 검색 메서드
    @Query("SELECT b FROM BoardEntity b WHERE " +
            "b.bodTitle LIKE %:keyword% OR " +
            "b.bodDtail LIKE %:keyword% OR " +
            "b.project.userNick LIKE %:keyword%")
     List<BoardEntity> findByAllKeyword(String keyword);

}
