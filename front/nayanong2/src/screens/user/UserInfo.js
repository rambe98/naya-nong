import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import "../../css/UserInfo.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  formDataAtom,
  confirmPwdAtom,
  userNicksuccessAtom,
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
  const [userNick, setUserNick] = useState('');


  const [validationMessage] = useRecoilState(validationMessageAtom); // 메시지 Atom 불러오기
  const [validationRegex] = useRecoilState(validationRegexAtom); // 정규식 Atom 불러오기
  const [message, setMessage] = useRecoilState(messageAtom); // 클라이언트 메시지
  const [smessage, setSMessage] = useRecoilState(smessageAtom); // 서버 메시지

  const clientNum = localStorage.getItem("clientNum")

  const [edit, setEdit] = useState(false);
  const [backupUserInfo, setBackupUserInfo] = useState(null); // 백업 상태
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시 여부
  const [isDeleteMode, setIsDeleteMode] = useState(false)// 회원탈퇴 모드 여부
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);//모바일모드
  
  // useEffect(() => {
  //   const updateScrollBehavior = () => {
  //     if (window.innerWidth <= 768) {
  //       document.body.classList.remove('no-scroll'); // 768px 이하일 때 스크롤 활성화
  //     } else {
  //       document.body.classList.add('no-scroll'); // 768px 이상일 때 스크롤 비활성화
  //     }
  //   };
  
  //   // 초기 실행
  //   updateScrollBehavior();
  
  //   // 리사이즈 이벤트 리스너 등록
  //   window.addEventListener('resize', updateScrollBehavior);
  
  //   // 페이지가 언마운트될 때 no-scroll 클래스 제거
  //   return () => {
  //     document.body.classList.remove('no-scroll'); // 클래스 제거
  //     window.removeEventListener('resize', updateScrollBehavior); // 리스너 제거
  //   };
  // }, []);
  
  

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
          setUserInfo(response.data); // Recoil 상태 업데이트
        } else {
          throw new Error("회원 정보를 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("회원정보 로드 실패:", error);
      }
    };

    loadUserDetails(); // 함수 호출
  }, [clientNum, setUserInfo]);


  // 비밀번호 확인
  const handlePasswordClick = async () => {
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const response = await axios.post(`${API_BASE_URL}/users/verifypassword`,
        {
          clientNum: clientNum,
          userPwd: password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 인증 토큰 추가
          },
        }
      );

      if (response.status === 200) {
        alert("비밀번호가 확인되었습니다.");
        setEdit(true); // 수정 모드 활성화
        setShowModal(false); // 모달 닫기
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  // 정보 저장
  const handleSaveClick = async () => {
    const isValid = validateForm(
      userInfo,
      validationMessage,
      validationRegex,
      setMessage
    );

    if (!isValid) return;

    const updatedUserInfo = { ...userInfo, userPwd: password };
    const token = localStorage.getItem("ACCESS_TOKEN");
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/${clientNum}`, updatedUserInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 인증 토큰 추가
          },
        }
      );
      console.log("전송 데이터:", updatedUserInfo); // 전송 데이터 로그 확인

      if (response.status === 200) {
        const updatedUser = response.data;

        setUserNick(updatedUser.userNick);
        //로컬스토리지의 유저닉네임 업데이트
        localStorage.setItem("userNick", updatedUser.userNick);

        alert("수정이 완료되었습니다.");
        setEdit(false);
        setPassword("");
        setMessage(""); // 메시지 초기화
        setSMessage(""); // 서버 메시지 초기화
        window.location.reload();
      }
    } catch (error) {
      console.error("저장 실패:", error);

      // 서버에서 반환된 메시지 처리
      if (error.response && error.response.status === 400) {
        setSMessage(error.response.data); // 서버 메시지 설정
      } else {
        setSMessage("저장 중 문제가 발생했습니다."); // 기본 오류 메시지
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "userPwd") {
      setPassword(value);
    } else {
      setUserInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setMessage(""); // 입력 중 클라이언트 메시지 초기화
    setSMessage(""); // 입력 중 서버 메시지 초기화
  };

  //수정모드 진입
  const handleEditClick = () => {
    setShowModal(true);
    setBackupUserInfo({ ...userInfo });

  };

  //회원 탈퇴
  const handleDelete = () => {
    setIsDeleteMode(true)
    setShowModal(true)
    
  }


  //회원 탈퇴요청
  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    try {
      //게시글 조회 (사용자가 작성한 게시글 목록 가져오기)
      const boardResponse = await axios.get(`${API_BASE_URL}/board`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseBoards = boardResponse.data;  // 게시글 목록
      // 현재 로그인된 사용자의 userNick
      const currentUserNick = localStorage.getItem("userNick");
      // 게시글 삭제
      for (let i = 0; i < responseBoards.length; i++) {
        const board = responseBoards[i];
        const bodNum = board.bodNum;
        const boardUserNick = board.userNick;  // 게시글 작성자의 userNick
        if (boardUserNick === currentUserNick) {
          try {
            // 게시글 삭제 요청
            const deleteBoardResponse = await axios.delete(`${API_BASE_URL}/board/${bodNum}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (deleteBoardResponse.status === 200) {
              console.log(`게시글 번호 ${bodNum} 삭제 완료`);
            }
          } catch (error) {
            console.error(`게시글 번호 ${bodNum} 삭제 실패`, error);
          }
        } else {
          console.log(`게시글 번호 ${bodNum}는 삭제 대상이 아님 (작성자: ${boardUserNick}, 현재 사용자: ${currentUserNick})`);
        }
      }
      // 회원 탈퇴 요청 (회원 정보를 먼저 삭제)
      const deleteUserResponse = await axios.delete(`${API_BASE_URL}/users/${clientNum}`, {
        data: { clientNum, userPwd: password },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (deleteUserResponse.status === 200) {
        console.log("회원 탈퇴가 완료되었습니다.");
        // 탈퇴 후, 토큰 및 사용자 정보 삭제
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("userNick");
        localStorage.removeItem('clientNum');
        localStorage.removeItem('userId');

        alert("회원 탈퇴가 완료되었습니다.");
        navigate('/board'); 
      }
    } catch (error) {
      console.error("회원 탈퇴 중 오류 발생", error);
      alert("회원 탈퇴에 실패했습니다.");
    }
  };




  //취소버튼 
  const handleCancelClick = () => {
    if (backupUserInfo) {
      setUserInfo({ ...backupUserInfo });
    }
    setPassword("");
    setEdit(false);
    setMessage("");
    setSMessage("");
  };


  //비밀번호 숨기기 / 보이기
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  //모달 취소버튼
  const modalCancelClick = () => {
    setPassword("");
    setShowModal(false);
    setIsDeleteMode(false)
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
