import { atom } from "recoil";

// 로그인 성공 여부 상태
export const loginsuccessAtom = atom({
    key: 'loginsuccess', // 고유 키
    default : false, // 기본값: 로그인 실패 상태
});

// 클라이언트 번호 상태
export const clientNumAtom = atom({
    key: 'clientNum', // 고유 키
    default: null, // 기본값: null
});

// 유저 닉네임 성공 여부 상태
export const userNicksuccessAtom = atom({
    key: 'userNicksuccess', // 고유 키
    default: null, // 기본값: null
});

// 클라이언트 메시지 상태
export const messageAtom = atom({
    key: "message", // 고유 키
    default: "", // 기본값: 빈 문자열
});

// 서버 메시지 상태
export const smessageAtom = atom({
    key: 'smessage', // 고유 키
    default: "", // 기본값: 빈 문자열
});

// 사용자 닉네임 상태
export const userNickAtom = atom({
    key: "userNick", // 고유 키
    default: "", // 기본값: 빈 문자열
});

// 사용자 아이디 상태
export const userIdAtom = atom({
    key: 'userId', // 고유 키
    default: '', // 기본값: 빈 문자열
});

// 사용자 비밀번호 상태
export const userPwdAtom = atom({
    key: 'userPwd', // 고유 키
    default: '', // 기본값: 빈 문자열
});

// 비밀번호 확인 상태
export const confirmPwdAtom = atom({
    key: 'confirmPwd', // 고유 키
    default: "", // 기본값: 빈 문자열
});

// 사용자 폼 데이터 상태
export const formDataAtom = atom({
  key: 'formDataAtom', // 고유 키
  default: {
      userName: "", // 사용자 이름
      userId: "", // 사용자 ID
      userPwd: "", // 비밀번호
      confirmPwd: "", // 비밀번호 확인
      userNick: "", // 닉네임
      userEmail: "", // 이메일
      userPnum: "", // 전화번호
      phoneCom: "", // 통신사
  },
});

// 유효성 검사 메시지 상태
export const validationMessageAtom = atom({
    key: 'validationMessage', // 고유 키
    default: {
        userName: "이름을 입력해주세요(한글만 가능).",
        userId: "아이디를 입력해주세요. (영문자와 숫자만 가능,4~20자)",
        userPwd: "비밀번호를 입력해주세요. (영문자,숫자,특수문자 포함 6~20자)",
        userNick: "닉네임을 입력해주세요.",
        userEmail: "이메일형식이 잘못되었습니다.",
        userPnum: "전화번호를 입력해주세요.(ex:01012345678)",
        phoneCom: "통신사를 선택해주세요.",
    },
});

// 유효성 검사 정규식 상태
export const validationRegexAtom = atom({
    key: 'validationRegex', // 고유 키
    default: {
        userNameRegex: /^[가-힣]{2,20}$/, // 한글만 허용, 2~20자
        userIdRegex: /^[a-zA-Z0-9]{4,20}$/, // 영문자와 숫자만 허용, 4~20자
        userPwdRegex: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{6,20}$/, // 영문자, 숫자, 특수문자 포함, 6~20자
        userEmailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // 이메일 형식
        userPnumRegex: /^01[0-9]\d{8}$/, // 전화번호 형식 (01012345678)
    },
});

// 폼 데이터 유효성 검사 함수
export const validateForm = (formData, validationMessage, validationRegex, setMessage) => {
    for (let key in validationMessage) {
        const value = formData[key] || ""; // 폼 데이터 값 가져오기
        const regex = validationRegex[key + "Regex"]; // 동적으로 정규식 접근

        // 빈 값 확인
        if (!value.trim()) {
            setMessage(validationMessage[key]); // 메시지 설정
            return false;
        }

        // 정규식 검증
        if (regex && !regex.test(value)) {
            setMessage(validationMessage[key]); // 메시지 설정
            return false;
        }
    }
    return true; // 유효성 검사를 통과한 경우 true 반환
};
