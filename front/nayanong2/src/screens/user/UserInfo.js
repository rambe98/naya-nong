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

const UserInfo = () => {
  const navigate = useNavigate();

  const [userPwd, setUserPwd] = useState(''); // 입력된 비밀번호
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

  //스크롤 없애기
  useEffect(() => {
    // body에 클래스 추가
    document.body.classList.add('no-scroll');

    // 언마운트 시 클래스 제거
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  // 사용자 정보 로드
  useEffect(() => {
    const loadUserDetails = async () => {
      const token = localStorage.getItem("ACCESS_TOKEN"); // 토큰 가져오기
      try {
        // 요청 보내기
        const response = await axios.get(`http://localhost:7070/users/${clientNum}`,
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
      const response = await axios.post("http://localhost:7070/users/verifypassword",
       {
          clientNum: clientNum,
          userPwd: userPwd,
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

    const updatedUserInfo = { ...userInfo, userPwd };
    const token = localStorage.getItem("ACCESS_TOKEN");
    try {
      const response = await axios.put(
        `http://localhost:7070/users/${clientNum}`,updatedUserInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 인증 토큰 추가
          },
        }
      );
  

      if (response.status === 200) {
        const updatedUser = response.data;

        setUserNick(updatedUser.userNick);

        sessionStorage.setItem("userNick", updatedUser.userNick);

        alert("수정이 완료되었습니다.");
        setEdit(false);
        setUserPwd("");
        setMessage(""); // 메시지 초기화
        setSMessage(""); // 서버 메시지 초기화
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
      setUserPwd(value);
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

  //취소버튼 
  const handleCancelClick = () => {
    if (backupUserInfo) {
      setUserInfo({ ...backupUserInfo });
    }
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
    setUserPwd("");
    setShowModal(false);
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
                value={userInfo.userPwd}
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
              <span className="userInfoFormText">{userInfo.userPnum}</span>
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
          </>
        )}
      </form>

      {showModal && (
        <div className="modalOverlay">
          <form
            className="modalContent"
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordClick();
            }}
          >
            <h3>비밀번호 확인</h3>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={userPwd}
              onChange={(e) => setUserPwd(e.target.value)}
              className="modalInput"
            />
            <div className="modalButtons">
              <button type="submit" className="modalConfirmButton">
                확인
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
