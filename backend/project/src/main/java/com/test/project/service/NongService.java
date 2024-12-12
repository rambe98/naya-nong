package com.test.project.service;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.test.project.dto.NongDTO;
import com.test.project.entity.NongEntity;
import com.test.project.persistence.BoardRepository;
import com.test.project.persistence.CommentRepository;
import com.test.project.persistence.HeartRepository;
import com.test.project.persistence.NongRepository;
import com.test.project.persistence.ParentCommentRepository;
import com.test.project.security.TokenProvider;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NongService {

	@Autowired
	private NongRepository repository;

	@Autowired 
	private BoardRepository bodrepository;
	
	@Autowired
	private CommentRepository conrepository;
	
	@Autowired
	private ParentCommentRepository conconrepository;
	
	@Autowired
	private HeartRepository heartrepository;
	
	@Autowired
	private TokenProvider tokenProvider;
	
    private final JavaMailSender mailSender;  // JavaMailSender 주입
    
    @Autowired
    private EmailService emailService;  // EmailService 주입받기
	
	

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
	}// showUser end
	
	// userId로 조회
	public NongEntity showUser(String userId) {
		return repository.findByUserId(userId)
				.orElseThrow(() -> new RuntimeException("User not found with userId: " + userId));
	}

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
	}// adduser end

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
	@Transactional
	public boolean deleteUsers(int clientNum) {
        Optional<NongEntity> user = repository.findById(clientNum);
        if (user.isPresent()) {
            // 회원과 관련된 데이터 삭제
        	NongEntity userEntity = user.get();
            // 좋아요 데이터 삭제
        	bodrepository.deleteByProject(userEntity); // 게시글 삭제
        	conrepository.deleteByNong(userEntity); // 댓글 삭제
        	heartrepository.deleteByNong(userEntity); // 좋아요 삭제
        	conconrepository.deleteByNong(userEntity); // 대댓글 삭제
        	repository.deleteById(clientNum);
            return true;
        } else {
            return false;
        }
    }

	// 토큰 생성
	public String generateToken(NongEntity nongEntity) {
		return tokenProvider.create(nongEntity); // 기존에 작성한 TokenProvider 사용
	}

	// 로그인 처리 시 토큰 반환
	public String authenticateAndGenerateToken(String userId, String userPwd) {
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
		return generateToken(entity); // 엔티티를 변경하지 않고 토큰만 반환
	}

	// 비밀번호 확인
	public void verifyPassword(int clientNum, String userPwd) {
		Optional<NongEntity> userEntity = repository.findByClientNumAndUserPwd(clientNum, userPwd);
		if (userEntity.isEmpty() || !userEntity.get().getUserPwd().equals(userPwd)) {
			throw new IllegalArgumentException("비밀번호가 틀립니다.");
		}
	}// verifyPassword end

	
	// 아이디 찾기
	public String findUserIdByEmail(String userEmail) {
	    Optional<NongEntity> user = repository.findByUserEmail(userEmail);
	    if (user.isPresent()) {
	        NongEntity entity = user.get();
	        String userId = entity.getUserId();
	        // 이메일 발송
	        emailService.sendEmail(userEmail, "아이디 찾기 결과", "당신의 아이디는 " + userId + " 입니다.");
	        return "아이디가 이메일로 전송되었습니다.";
	    } else {
	        return "해당 이메일에 해당하는 사용자 정보가 없습니다.";
	    }
	}

    // 비밀번호 찾기
	public String findPasswordByUserIdAndEmail(String userId, String userEmail) {
	    Optional<NongEntity> user = repository.findByUserIdAndUserEmail(userId, userEmail);
	    if (user.isPresent()) {
	        String verificationCode = generateVerificationCode();  // 인증번호 생성
	        emailService.sendEmail(userEmail, "비밀번호 찾기 인증번호", "인증번호는 " + verificationCode + " 입니다.");
	        return "인증번호가 이메일로 전송되었습니다.";
	    } else {
	        return "입력하신 정보가 일치하는 사용자가 없습니다.";
	    }
	}

    // 인증번호 생성 메서드
	private String generateVerificationCode() {
	    Random random = new Random();
	    int code = random.nextInt(9000) + 1000;  // 1000 ~ 9999 사이의 숫자
	    return String.valueOf(code);
	}

    // 비밀번호 업데이트
	public String updatePassword(String userId, String newPassword) {
	    Optional<NongEntity> user = repository.findByUserId(userId);
	    if (user.isPresent()) {
	        NongEntity entity = user.get();
	        entity.setUserPwd(newPassword);  // 새로운 비밀번호로 업데이트
	        repository.save(entity);  // DB에 저장
	        return "비밀번호가 성공적으로 변경되었습니다.";
	    } else {
	        return "사용자를 찾을 수 없습니다.";
	    }
	}

}// class end
