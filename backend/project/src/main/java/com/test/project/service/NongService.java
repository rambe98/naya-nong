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
import com.test.project.security.TokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NongService {

	@Autowired
	private NongRepository repository;
	
	@Autowired
	private TokenProvider tokenProvider;

	// entity가 비었는지 확인
	private void validate(final NongEntity entity) {
		if (entity == null) {
			throw new RuntimeException("Entity cannot be null.");
		}
	}// validate end
	

	// 조회
	public List<NongDTO> showAllUsers() {
		return repository.findAll().stream().map(NongDTO::new).collect(Collectors.toList());
	}// showAllUsers end
	

	// 개별 조회
	public NongDTO showUser(int clientNum) {
		NongEntity entity = repository.findById(clientNum).orElseThrow(() -> new RuntimeException("User not found"));
		return new NongDTO(entity);
	}//showUser end

	// 추가
	public NongDTO adduser(NongDTO dto) {
		// DTO를 Entity로 변환
		NongEntity entity = dto.toEntity(dto);
		// 아이디 중복 체크
		if (repository.existsByUserId(entity.getUserId())) {
			throw new IllegalArgumentException("중복된 아이디가 있습니다.");
		}
		// 별명 중복 체크
		if (repository.existsByUserNick(entity.getUserNick())) {
			throw new IllegalArgumentException("중복된 닉네임이 있습니다.");
		}
		// 이메일 중복 체크
		if (repository.existsByUserEmail(entity.getUserEmail())) {
			throw new IllegalArgumentException("중복된 이메일이 있습니다.");
		}
		// 중복이 없으면 새 사용자 저장
		NongEntity savedEntity = repository.save(entity);
		return new NongDTO(savedEntity); // 저장된 엔티티를 DTO로 변환하여 반환
	}//adduser end
	

	// 수정
	public NongDTO updateUsers(NongDTO dto) {
	       NongEntity entity = dto.toEntity(dto);
	       
	       // 이메일과 닉네임 중복 체크
	       Optional<NongEntity> existingEmail = repository.findByUserEmail(entity.getUserEmail());
	       Optional<NongEntity> existingNick = repository.findByUserNick(entity.getUserNick());
	       
	       // 이메일이나 닉네임이 이미 존재하는 경우, 수정 불가
	       if (existingEmail.isPresent() && existingEmail.get().getClientNum() != entity.getClientNum()) {
	           throw new IllegalArgumentException("이메일이 이미 존재합니다.");
	       }
	       
	       if (existingNick.isPresent() && existingNick.get().getClientNum() != entity.getClientNum()) {
	           throw new IllegalArgumentException("닉네임이 이미 존재합니다.");
	       }

	       Optional<NongEntity> original = repository.findById(entity.getClientNum());
	       if (original.isPresent()) {
	           NongEntity nong = original.get();
	           nong.setUserId(entity.getUserId()); // 관리자 권한으로 백엔드에서 수동으로 설정할 수 있게 만듦
	           nong.setUserPwd(entity.getUserPwd());
	           nong.setUserEmail(entity.getUserEmail());
	           nong.setUserNick(entity.getUserNick());
	           repository.save(nong);
	           return new NongDTO(nong);
	       }
	       return null; // 찾지 못한 경우
	   }
	

	// 삭제
	public boolean deleteUsers(NongDTO dto) {
		NongEntity entity = dto.toEntity(dto);
		Optional<NongEntity> original = repository.findById(entity.getClientNum());
		if (original.isPresent()) {
			repository.delete(entity);
			return true;
		} // if end
		else {
			return false;
		} // else end
	}// deleteUsers end
	

	// 토큰 생성
	public String generateToken(NongEntity nongEntity) {
	    return tokenProvider.create(nongEntity); // 기존에 작성한 TokenProvider 사용
	}

	// 로그인 처리 시 토큰 반환
	public NongEntity getBycredentials(String userId, String userPwd) {
	    // 아이디로 사용자 확인
	    Optional<NongEntity> userEntity = repository.findByUserId(userId);
	    if (userEntity.isEmpty()) {
	        throw new IllegalArgumentException("아이디가 존재하지 않습니다.");
	    }

	    // 비밀번호 확인
	    NongEntity entity = userEntity.get();
	    if (!entity.getUserPwd().equals(userPwd)) {
	        throw new IllegalArgumentException("비밀번호가 틀렸습니다.");
	    }

	    // 인증 성공 시 토큰 생성
	    String token = generateToken(entity);
	    entity.setToken(token); // 사용자의 토큰을 저장 (선택 사항)

	    return entity; // 인증된 엔티티 반환
	}
	

	// 비밀번호 확인
	public void verifyPassword(int clientNum, String userPwd) {
		Optional<NongEntity> userEntity = repository.findByClientNumAndUserPwd(clientNum, userPwd);
		if (userEntity.isEmpty() || !userEntity.get().getUserPwd().equals(userPwd)) {
			throw new IllegalArgumentException("비밀번호가 틀립니다.");
		}
	}//verifyPassword end

}// class end
