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
	

	@GetMapping("/{clientNum}")
	public ResponseEntity<?> showUser(@PathVariable("clientNum") int clientNum) {
		NongDTO user = service.showUser(clientNum);
		return ResponseEntity.ok(user);
	}// showAllusers end
	

	@PostMapping("/signup")
	public ResponseEntity<?> adduser(@RequestBody NongDTO dto) {
		try {
			NongDTO users = service.adduser(dto);
			return ResponseEntity.status(HttpStatus.CREATED).body(users);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}// adduser end
	
	@PostMapping("/signin")
	public ResponseEntity<?> authenticate(@RequestBody NongDTO dto) {
	    String userId = dto.getUserId();
	    String userPwd = dto.getUserPwd();

	    if (userId == null || userPwd == null) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("아이디 또는 비밀번호를 찾을 수 없습니다.");
	    }

	    try {
	        // 자격 증명 확인
	        NongEntity user = service.getBycredentials(userId, userPwd);

	        // JWT 토큰 생성
	        String token = service.generateToken(user);

	        // 응답에 토큰 추가
	        return ResponseEntity.ok(Map.of("token", token, "user", new NongDTO(user)));

	    } catch (IllegalArgumentException e) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
	    }
	}
	

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
	}//verifyPassword end
	

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
	

	@DeleteMapping("/{clientNum}")
	public ResponseEntity<?> deleteUsers(NongDTO dto) {
		boolean isDeleted = service.deleteUsers(dto);
		try {
			if (isDeleted) {
				return ResponseEntity.ok("회원이 탈퇴되었습니다.");
			} else {
				return ResponseEntity.status(404).body("회원정보를 찾을 수 없습니다.");
			}
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("데이터에러");
		} // catch end
	}// deleteUsers end
	

	

}// class end
