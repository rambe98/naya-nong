package com.test.project.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
   
    //조회
 	public List<NongDTO> showAllUsers(){
 		return repository.findAll().stream().map(NongDTO::new).collect(Collectors.toList());
 	}//showAllUsers end
 	
 	//개별 조회
 	public NongDTO showUser(int clientNum) {
 		 NongEntity entity = repository.findById(clientNum)
 	            .orElseThrow(() -> new RuntimeException("User not found"));
 		
 		return new NongDTO(entity);
 	}
   
   
   // 추가
 	public NongDTO adduser(NongDTO dto) {
        // DTO를 Entity로 변환
        NongEntity entity = dto.toEntity(dto);

        // 아이디 중복 체크
        if (repository.existsByUserId(entity.getUserId())) {
            throw new IllegalArgumentException("아이디가 이미 있습니다.");
        }

        // 별명 중복 체크
        if (repository.existsByUserNick(entity.getUserNick())) {
            throw new IllegalArgumentException("별명 이미 있습니다.");
        }

        // 이메일 중복 체크
        if (repository.existsByUserEmail(entity.getUserEmail())) {
            throw new IllegalArgumentException("이메일 이미 있습니다.");
        }

        // 중복이 없으면 새 사용자 저장
        NongEntity savedEntity = repository.save(entity);
        return new NongDTO(savedEntity);  // 저장된 엔티티를 DTO로 변환하여 반환
    }
	
 	public NongDTO getBycredentials(final String userId, final String userPwd) {
 		NongEntity entity = repository.findByUserIdAndUserPwd(userId, userPwd);
 		return new NongDTO(entity);
 	}
	
	
	
	
	//수정
	public NongDTO updateUsers(NongDTO dto){
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
	         
	         return new NongDTO(nong); 
	      }//if end
	      
	        return null;  
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
