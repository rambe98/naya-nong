import React, { useState, useEffect } from "react";
import "../../css/UserInfo.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  formDataAtom,
  validationMessageAtom,
  validationRegexAtom,
  validateForm,
  messageAtom,
  smessageAtom,
} from "../../recoil/UserRecoil";
import { API_BASE_URL } from "../../service/api-config";

const UserInfo = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState(''); // 입력된 비밀번호
  const [userInfo, setUserInfo] = useRecoilState(formDataAtom); // userInfo의 초기값
  const [userNick, setUserNick] = useState(''); //사용자의 닉네임을 저장하는 상태


  const [validationMessage] = useRecoilState(validationMessageAtom); // 메시지 Atom 불러오기
  const [validationRegex] = useRecoilState(validationRegexAtom); // 정규식 Atom 불러오기
  const [message, setMessage] = useRecoilState(messageAtom); // 클라이언트 메시지
  const [smessage, setSMessage] = useRecoilState(smessageAtom); // 서버 메시지

  const clientNum = localStorage.getItem("clientNum") //사용자 정보를 식별하기 위한 고유번호를 로컬스토리지에서 가져옴

  const [edit, setEdit] = useState(false); //수정모드 활성/ 비활성 관리 상태
  const [backupUserInfo, setBackupUserInfo] = useState(null); // 백업 상태
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시 여부
  const [isDeleteMode, setIsDeleteMode] = useState(false)// 회원탈퇴 모드 여부
<<<<<<< HEAD
  
=======

>>>>>>> 9049cda8736d39708ccb1c71054d4b0504740584
  // 사용자 정보 로드
  useEffect(() => {
    const loadUserDetails = async () => {
      const token = localStorage.getItem("ACCESS_TOKEN"); // 토큰 가져오기
      try {
        // 요청 보내기
        const response = await axios.get(`${API_BASE_URL}/users/${clientNum}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 인증 토큰 추가
            },
          }
        );

        // 서버에서 데이터 받아서 상태 업데이트
        if (response.data.clientNum) {
          setUserInfo(response.data); // Recoil FormData 업데이트
        } else {
          throw new Error("회원 정보를 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("회원정보 로드 실패:", error);
      }
    };

    loadUserDetails(); // 함수 호출
  }, [clientNum, setUserInfo]); //clientNum(사용자 고유번호)와 Recoil FormData가 업데이트될때마다 실행


  // 비밀번호 확인 요청 함수
  const handlePasswordClick = async () => {
    try {
      const token = localStorage.getItem("ACCESS_TOKEN"); // 로컬스토리지에서 토큰 가져오기
      const response = await axios.post(`${API_BASE_URL}/users/verifypassword`, {
        clientNum: clientNum, // 사용자 고유 번호 전달
        userPwd: password, // 입력된 비밀번호 전달
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // 인증 헤더 추가
        },
      });

      if (response.status === 200) {
        alert("비밀번호가 확인되었습니다."); // 비밀번호 일치 시 알림
        setEdit(true); // 수정 모드 활성화
        setShowModal(false); // 모달 닫기
      } else {
        alert("비밀번호가 일치하지 않습니다."); // 비밀번호 불일치 시 알림
      }
    } catch (error) {
      console.error(error); // 오류 로그 출력
      alert("비밀번호가 일치하지 않습니다."); // 예외 발생 시 알림
    }
  };


  // 정보 저장 함수
  const handleSaveClick = async () => {
    const isValid = validateForm( // 유효성 검사 실행
      userInfo,
      validationMessage,
      validationRegex,
      setMessage
    );

    if (!isValid) return; // 유효성 검사를 통과하지 못하면 종료

    const updatedUserInfo = { ...userInfo, userPwd: password }; // 사용자 정보와 비밀번호를 포함한 객체 생성
    const token = localStorage.getItem("ACCESS_TOKEN"); // 로컬스토리지에서 토큰 가져오기
    try {
      const response = await axios.put( // 사용자 정보 업데이트 요청
        `${API_BASE_URL}/users/${clientNum}`, updatedUserInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 인증 헤더 추가
          },
        }
      );

      if (response.status === 200) { // 요청 성공 시
        const updatedUser = response.data; // 서버에서 반환된 사용자 정보

        setUserNick(updatedUser.userNick); // 닉네임 상태 업데이트
        localStorage.setItem("userNick", updatedUser.userNick); // 로컬스토리지의 닉네임 업데이트

        alert("수정이 완료되었습니다."); // 수정 완료 알림
        setEdit(false); // 수정 모드 비활성화
        setPassword(""); // 비밀번호 초기화
        setMessage(""); // 클라이언트 메시지 초기화
        setSMessage(""); // 서버 메시지 초기화
        window.location.reload(); // 페이지 새로고침
      }
    } catch (error) {
      console.error("저장 실패:", error); // 오류 로그 출력

      if (error.response && error.response.status === 400) {
        setSMessage(error.response.data); // 서버에서 반환된 메시지 설정
      } else {
        setSMessage("저장 중 문제가 발생했습니다."); // 기본 오류 메시지 설정
      }
    }
  };


// 입력값 변경 핸들러 함수
// 비밀번호 확인 요청 API로 전달해야하기 때문에 비밀번호는 다른 사용자 정보와는 다르게 관리함
// 보안과 유지보수 관점에서 안전하고 명확하다.
const handleInputChange = (e) => {
  const { name, value } = e.target; // 입력된 폼 요소의 이름(name)과 값(value)을 가져옴

  if (name === "userPwd") {
    setPassword(value); // 비밀번호 입력 시 password 상태 업데이트
  } else {
    setUserInfo((prev) => ({
      ...prev, // 기존 사용자 정보 유지
      [name]: value, // 변경된 값 업데이트
    }));
  }
  setMessage(""); // 클라이언트 에러 메시지 초기화
  setSMessage(""); // 서버 에러 메시지 초기화
};


// 수정 모드 진입 함수
const handleEditClick = () => {
  setShowModal(true); // 모달 창 표시
  setBackupUserInfo({ ...userInfo }); // 현재 사용자 정보를 백업
};

// 회원 탈퇴 모드 진입 함수
const handleDelete = () => {
  setIsDeleteMode(true); // 회원 탈퇴 모드 활성화
  setShowModal(true); // 모달 창 표시
};



// 회원 탈퇴 요청 함수
const handleDeleteConfirm = async () => {
  const token = localStorage.getItem("ACCESS_TOKEN"); // 로컬 스토리지에서 토큰 가져오기
  try {
    // 게시글 조회 (사용자가 작성한 게시글 목록 가져오기)
    const boardResponse = await axios.get(`${API_BASE_URL}/board`, {
      headers: {
        Authorization: `Bearer ${token}`, // 인증 헤더 추가
      },
    });
    const responseBoards = boardResponse.data; // 게시글 목록 가져오기
    const currentUserNick = localStorage.getItem("userNick"); // 현재 로그인된 사용자의 닉네임 가져오기

    // 게시글 삭제
    for (let i = 0; i < responseBoards.length; i++) {
      const board = responseBoards[i];
      const bodNum = board.bodNum; // 게시글 번호
      const boardUserNick = board.userNick; // 게시글 작성자의 닉네임
      if (boardUserNick === currentUserNick) {
        try {
          // 게시글 삭제 요청
          const deleteBoardResponse = await axios.delete(`${API_BASE_URL}/board/${bodNum}`, {
            headers: {
              Authorization: `Bearer ${token}`, // 인증 헤더 추가
            },
          });
        } catch (error) {
          console.error(`게시글 번호 ${bodNum} 삭제 실패`, error); // 게시글 삭제 실패 로그 출력
        }
      }
    }

    // 회원 탈퇴 요청
    const deleteUserResponse = await axios.delete(`${API_BASE_URL}/users/${clientNum}`, {
      data: { clientNum, userPwd: password }, // 사용자 정보와 비밀번호 전달
      headers: {
        Authorization: `Bearer ${token}`, // 인증 헤더 추가
      },
    });

    if (deleteUserResponse.status === 200) {
      // 탈퇴 성공 시 토큰 및 사용자 정보 삭제
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("userNick");
      localStorage.removeItem('clientNum');
      localStorage.removeItem('userId');
      alert("회원 탈퇴가 완료되었습니다."); // 탈퇴 성공 알림
      navigate('/'); // 메인 페이지로 이동
    }
  } catch (error) {
    console.error("회원 탈퇴 중 오류 발생", error); // 탈퇴 중 오류 로그 출력
    alert("회원 탈퇴에 실패했습니다."); // 탈퇴 실패 알림
  }
};





// 취소 버튼 클릭 시 동작
const handleCancelClick = () => {
  if (backupUserInfo) {
    setUserInfo({ ...backupUserInfo }); // 백업된 사용자 정보로 복구
  }
  setPassword(""); // 비밀번호 초기화
  setEdit(false); // 수정 모드 비활성화
  setMessage(""); // 클라이언트 메시지 초기화
  setSMessage(""); // 서버 메시지 초기화
};

// 비밀번호 숨기기/보이기 토글
const togglePasswordVisibility = () => {
   // 비밀번호 표시 상태를 반전  
   // 이전 상태값(prev)이 true면 false로, false면 true로 변경
   setShowPassword((prev) => !prev);
};

// 모달 취소 버튼 클릭 시 동작
const modalCancelClick = () => {
  setPassword(""); // 비밀번호 초기화
  setShowModal(false); // 모달 창 닫기
  setIsDeleteMode(false); // 회원 탈퇴 모드 비활성화
};



  return (
    <div className="userInfoContainer">
      <h2 className="userInfoHeader">회원정보수정</h2>

      <form className="userInfoForm">
        {edit ? (
          <>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">아이디:</label>
              <span className="userInfoFormText">{userInfo.userId}</span>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">이름:</label>
              <span className="userInfoFormText">{userInfo.userName}</span>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">비밀번호:</label>
              <input
                className="userInfoFormInput"
                type={showPassword ? "text" : "password"}
                name="userPwd"
                value={password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="togglePasswordButton"
              >
                {showPassword ? "숨기기" : "보이기"}
              </button>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">닉네임:</label>
              <input
                className="userInfoFormInput"
                type="text"
                name="userNick"
                value={userInfo.userNick}
                onChange={handleInputChange}
              />
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">이메일:</label>
              <input
                className="userInfoFormInput"
                type="text"
                name="userEmail"
                value={userInfo.userEmail}
                onChange={handleInputChange}
              />
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">핸드폰번호:</label>
              <span className="userInfoFormText">{userInfo.userPnum}</span>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">통신사:</label>
              <span className="userInfoFormText">{userInfo.phoneCom}</span>
            </div>
            {message && <p className="errorText">{message}</p>}
            {smessage && <p className="errorText">{smessage}</p>}
            <button
              className="userInfoFormButton"
              type="button"
              onClick={handleSaveClick}
            >
              저장
            </button>
            <button
              className="userInfoFormButton userInfoFormCancelButton"
              type="button"
              onClick={handleCancelClick}
            >
              취소
            </button>
          </>
        ) : (
          <>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">아이디:</label>
              <span className="userInfoFormText">{userInfo.userId}</span>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">이름:</label>
              <span className="userInfoFormText">{userInfo.userName}</span>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">비밀번호:</label>
              <span className="userInfoFormText">
                {"*".repeat(userInfo.userPwd?.length || 0)}
              </span>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">닉네임:</label>
              <span className="userInfoFormText">{userInfo.userNick}</span>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">이메일:</label>
              <span className="userInfoFormText">{userInfo.userEmail}</span>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">핸드폰번호:</label>
              <span className="userInfoFormText">{"*".repeat(userInfo.userPnum?.length || 0)}</span>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">통신사:</label>
              <span className="userInfoFormText">{userInfo.phoneCom}</span>
            </div>
            <button
              className="userInfoFormButton"
              type="button"
              onClick={handleEditClick}
            >
              수정
            </button>
            <button
              className="userInfoFormButton userInfoFormCancelButton"
              type="button"
              onClick={() => navigate("/")}
            >
              돌아가기
            </button>
            <button
              className="userInfoFormButton userInfoFormCancelButton"
              type="button"
              onClick={handleDelete}>
              회원탈퇴
            </button>
          </>
        )}
      </form>

      {showModal && (
        <div className="modalOverlay">
          <form
            className="modalContent"
            onSubmit={(e) => {
              e.preventDefault();
              if (isDeleteMode) {
                handleDeleteConfirm(); //회원탈퇴
              } else {
                handlePasswordClick(); // 비밀번호 확인
              }
            }}
          >
            <h3>{isDeleteMode ? "회원탈퇴 확인" : "비밀번호 확인"}</h3>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="modalInput"
            />
            <div className="modalButtons">
              <button type="submit" className="modalConfirmButton">
                {isDeleteMode ? "회원탈퇴" : "확인"}
              </button>
              <button
                type="button"
                onClick={modalCancelClick}
                className="modalCancelButton"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
