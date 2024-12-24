package com.test.project.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.test.project.dto.BoardDTO;
import com.test.project.dto.QnADTO;
import com.test.project.entity.BoardEntity;
import com.test.project.entity.NongEntity;
import com.test.project.entity.QnAEntity;
import com.test.project.persistence.NongRepository;
import com.test.project.persistence.QnARepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QnAService {

	@Autowired
	private QnARepository repository;
	
	@Autowired
	private NongRepository nongRepository;
	
	// entity가 비었는지 확인
	private void validate(final QnAEntity entity) {
		if (entity == null) {
			throw new RuntimeException("Entity cannot be null.");
		}
	}// validate end

	// 조회
	public List<QnADTO> showAllQna() {
		return repository.findAll().stream().map(QnADTO::new).collect(Collectors.toList());
	}// showAllUsers end

	
	// 개별 조회
	public QnADTO showQna(int qnaNum) {
		QnAEntity entity = repository.findById(qnaNum).orElseThrow(() -> new RuntimeException("User not found"));
		return new QnADTO(entity);
	}

	
	// 추가
	@Transactional
	public QnADTO addQna(QnADTO dto) {
		NongEntity userEntity = nongRepository.findByUserNick(dto.getUserNick())
                .orElseThrow(() -> new RuntimeException("User not found"));
		
		QnAEntity entity = dto.toEntity(dto);
		
		entity.setNong(userEntity);
		return new QnADTO(repository.save(entity));
	}

}// class end
