package com.test.project.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.test.project.dto.BoardDTO;
import com.test.project.entity.BoardEntity;
import com.test.project.persistence.BoardRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardService {
	
	@Autowired
	private BoardRepository repository;
	
	private void validate(final BoardEntity entity) {
	       if(entity == null) {
	           throw new RuntimeException("Entity cannot be null.");
	       }
	   }//validate end
	
	
	//추가
	public BoardDTO addBoard(BoardDTO dto) {
		BoardEntity entity = dto.toEntity(dto);
		return new BoardDTO(repository.save(entity));
	}//addBoard end
	
	
	//조회
	public List<BoardDTO> showAllBoard(){
		return repository.findAll().stream().map(BoardDTO::new).collect(Collectors.toList());
		}//showAllBoard end
	
	
	//수정
	public List<BoardDTO> updateBoard(BoardDTO dto){
		BoardEntity entity =  dto.toEntity(dto);
		      
		Optional<BoardEntity> original = repository.findById(entity.getBodNum());
		      
		      if(original.isPresent()) {
		    	  BoardEntity nong = original.get();
		         nong.setBodTitle(entity.getBodTitle());
		         nong.setBodDtail(entity.getBodDtail());
		         repository.save(nong);      
		      }//if end
		      
		       return showAllBoard();      
		   }//updateBoard end
	
	
	 //삭제
	   public boolean deleteBoard(BoardDTO dto){
	      
		   BoardEntity entity = dto.toEntity(dto);
	      
	      Optional<BoardEntity> original = repository.findById(entity.getBodNum());
	      
	      if(original.isPresent()) {
	         repository.delete(entity);
	         return true;
	      }//if end
	          
	      else {
	         return false;
	      }//else end
	         

	   
	   }//deleteUsers end
	
	

}

















