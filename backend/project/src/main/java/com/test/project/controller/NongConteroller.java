package com.test.project.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.test.project.dto.NongDTO;
import com.test.project.entity.NongEntity;
import com.test.project.service.NongService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
public class NongConteroller {

	@Autowired
	private NongService service;

	@GetMapping
	public ResponseEntity<?> showAllUsers() {
		List<NongDTO> products = service.showAllUsers();
		return ResponseEntity.ok(products);
	}// showAllusers end
	// 회원 정보 조회
	@GetMapping("/{clientNum}")
	public ResponseEntity<?> showUser(@PathVariable("clientNum") int clientNum) {
		NongDTO user = service.showUser(clientNum);
		return ResponseEntity.ok(user);
	}// showAllusers end
	// 회원 가입
	@PostMapping("/signup")
	public ResponseEntity<?> adduser(@RequestBody NongDTO dto) {
		try {
			NongDTO users = service.adduser(dto);
			return ResponseEntity.status(HttpStatus.CREATED).body(users);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}// adduser end
	// 로그인 
	@PostMapping("/signin")
	public ResponseEntity<?> authenticate(@RequestBody NongDTO dto) {
		String userId = dto.getUserId();
		String userPwd = dto.getUserPwd();

		if (userId == null || userPwd == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("아이디 또는 비밀번호를 찾을 수 없습니다.");
		}

		try {
			// 1. 인증 및 토큰 생성
			String token = service.authenticateAndGenerateToken(userId, userPwd);

			// 2. 사용자 정보 조회
			NongEntity userEntity = service.showUser(userId); // userId로 사용자 조회
			NongDTO responseDto = new NongDTO(userEntity);

			// 3. 응답에 토큰과 사용자 정보 포함
			return ResponseEntity.ok(Map.of("token", token, "user", responseDto));

		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
		}
	}
	// 회원 수정 시 비밀번호 확인
	@PostMapping("/verifypassword")
	public ResponseEntity<?> verifyPassword(@RequestBody NongDTO dto) {
		int clientNum = dto.getClientNum();
		String userPwd = dto.getUserPwd();
		try {
			// 서비스에서 비밀번호 확인
			service.verifyPassword(clientNum, userPwd);
			return ResponseEntity.ok("비밀번호 확인 완료했습니다.");
		} catch (IllegalArgumentException e) {
			// 비밀번호가 틀린 경우
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
		}
	}// verifyPassword end
	// 회원 수정
	@PutMapping("/{clientNum}")
	public ResponseEntity<?> updateUsers(@RequestBody NongDTO dto, @PathVariable("clientNum") int clientNum) {
		try {
			// clientNum을 dto에 세팅하거나, dto에서 확인하는 로직 추가
			if (clientNum != dto.getClientNum()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("클라이언트 번호가 일치하지 않습니다.");
			}

			NongDTO users = service.updateUsers(dto);

			if (users == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
			}

			return ResponseEntity.ok().body(users);
		} catch (IllegalArgumentException e) {
			// 이메일, 닉네임 중복으로 IllegalArgumentException 발생 시
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			// 그 외의 예외 처리
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
		}
	}
	// 회원 탈퇴
	@DeleteMapping("/{clientNum}")
	public ResponseEntity<?> deleteUsers(@PathVariable("clientNum") int clientNum) {
		try {
			boolean isDeleted = service.deleteUsers(clientNum);
			if (isDeleted) {
				return ResponseEntity.ok("회원 및 관련 데이터가 삭제되었습니다.");
			} else {
				return ResponseEntity.status(404).body("회원정보를 찾을 수 없습니다.");
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).body("서버 에러가 발생했습니다: " + e.getMessage());
		}
	}
	// 아이디 찾기
	@PostMapping("/find-id/{userEmail}")
	public String findUserId(@PathVariable("userEmail") String userEmail) {
	    // 이메일을 기반으로 유저의 아이디를 찾고, 이메일로 발송
	    return service.findUserIdByEmail(userEmail);
	}
    // 비밀번호 찾기
    @PostMapping("/find-password")
    public String findPassword(@RequestParam String userId, @RequestParam String userEmail) {
        // userId와 email을 기반으로 인증번호를 생성하여 이메일로 전송
        return service.findPasswordByUserIdAndEmail(userId, userEmail);
    }
    // 비밀번호 업데이트
    @PostMapping("/update-password")
    public String updatePassword(@RequestParam String userId, @RequestParam String newPassword) {
        // 인증을 마친 후 새로운 비밀번호로 업데이트
        return service.updatePassword(userId, newPassword);
    }
}// class end
