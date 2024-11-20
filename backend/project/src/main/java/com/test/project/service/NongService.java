package com.test.project.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.test.project.dto.NongDTO;
import com.test.project.entity.NongEntity;
import com.test.project.persistence.NongRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NongService {
	
   @Autowired
   private NongRepository repository;
   
   //entity가 비었는지 확인
   private void validate(final NongEntity entity) {
       if(entity == null) {
           throw new RuntimeException("Entity cannot be null.");
       }
   }//validate end
   
   
   // 추가
	public NongDTO adduser(NongDTO dto) {
		NongEntity entity = dto.toEntity(dto);
		return new NongDTO(repository.save(entity));
	}//adduser end
	
	
	//조회
	public List<NongDTO> showAllUsers(){
		return repository.findAll().stream().map(NongDTO::new).collect(Collectors.toList());
	}//showAllUsers end
	
	//수정
	public List<NongDTO> updateUsers(NongDTO dto){
	      NongEntity entity =  dto.toEntity(dto);
	      
	      Optional<NongEntity> original = repository.findById(entity.getClientNum());
	      
	      if(original.isPresent()) {
	         NongEntity nong = original.get();
	         nong.setUserId(entity.getUserId());
	         nong.setUserPwd(entity.getUserPwd());
	         nong.setUserEmail(entity.getUserEmail());
	         nong.setUserPnum(entity.getUserPnum());    
	         nong.setUserNick(entity.getUserNick());
	         repository.save(nong);      
	      }//if end
	      
	       return showAllUsers();      
	   }//updateUsers end
	
	   
	   //삭제
	   public boolean deleteUsers(NongDTO dto){
	      
	       NongEntity entity = dto.toEntity(dto);
	      
	      Optional<NongEntity> original = repository.findById(entity.getClientNum());
	      
	      if(original.isPresent()) {
	         repository.delete(entity);
	         return true;
	      }//if end
	          
	      else {
	         return false;
	      }//else end
	         

	   
	   }//deleteUsers end
	
}//class end
