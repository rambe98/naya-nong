package com.test.project.service;

import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
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
		return repository.findAll().stream()
				.map(NongDTO::new).collect(Collectors.toList());
	}// showAllUsers end
	// 개별 조회
	public NongDTO showUser(int clientNum) {
		NongEntity entity = repository.findById(clientNum)
				.orElseThrow(() -> new RuntimeException("User not found"));
		return new NongDTO(entity);
	}// showUser end
	// userId로 조회
	public NongEntity showUser(String userId) {
		return repository.findByUserId(userId)
				.orElseThrow(() -> 
				new RuntimeException("User not found with userId: " + userId));
	}
	// 추가
	public NongDTO adduser(NongDTO dto) {
		// DTO를 Entity로 변환
		NongEntity entity = dto.toEntity(dto);
		// 아이디 중복 체크
		if (repository.existsByUserId(entity.getUserId())) {
			throw new IllegalArgumentException("중복된 아이디가 있습니다.");}
		// 별명 중복 체크
		if (repository.existsByUserNick(entity.getUserNick())) {
			throw new IllegalArgumentException("중복된 닉네임이 있습니다.");}
		// 이메일 중복 체크
		if (repository.existsByUserEmail(entity.getUserEmail())) {
			throw new IllegalArgumentException("중복된 이메일이 있습니다.");}
		// 중복이 없으면 새 사용자 저장
		NongEntity savedEntity = repository.save(entity);
		// 저장된 엔티티를 DTO로 변환하여 반환
		return new NongDTO(savedEntity); 
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
	        String verificationCode = generateVerificationCode();  // 임시 비밀번호 생성
	        NongEntity entity = user.get();
	        entity.setUserPwd(verificationCode);
	        repository.save(entity);
	        emailService.sendEmail(userEmail, "(나야, 농) 임시 비밀번호", "임시 비밀번호는 " + verificationCode + " 입니다. 로그인 후 보안을 위해 회원 정보 수정을 부탁드립니다.");
	        return "임시 비밀번호가 이메일로 전송되었습니다.";
	    } else {
	        return "입력하신 정보가 일치하는 사용자가 없습니다.";
	    }
	}

    // 인증번호 생성 메서드
	private String generateVerificationCode() {
	    String upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	    String lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
	    String digits = "0123456789";
	    String specialCharacters = "!@#$%^&*()_+";
	    String allCharacters = upperCaseLetters + lowerCaseLetters + digits + specialCharacters;

	    StringBuilder code = new StringBuilder();
	    Random random = new Random();

	    // 각각 하나씩 포함
	    code.append(upperCaseLetters.charAt(random.nextInt(upperCaseLetters.length())));
	    code.append(lowerCaseLetters.charAt(random.nextInt(lowerCaseLetters.length())));
	    code.append(digits.charAt(random.nextInt(digits.length())));
	    code.append(specialCharacters.charAt(random.nextInt(specialCharacters.length())));

	    // 나머지 두 자리를 랜덤하게 추가
	    for (int i = 0; i < 2; i++) {
	        code.append(allCharacters.charAt(random.nextInt(allCharacters.length())));
	    }

	    // 결과를 무작위로 섞기
	    List<Character> codeList = new ArrayList<>();
	    for (char c : code.toString().toCharArray()) {
	        codeList.add(c);
	    }
	    Collections.shuffle(codeList);

	    // 다시 문자열로 변환
	    StringBuilder shuffledCode = new StringBuilder();
	    for (char c : codeList) {
	        shuffledCode.append(c);
	    }

	    return shuffledCode.toString();
	}

}// class end
