import React, { useState, useEffect } from "react";
import "../../css/Signup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilState, useResetRecoilState } from "recoil";
import { API_BASE_URL } from '../../service/api-config';
import {
  formDataAtom,
  messageAtom,
  smessageAtom,
  validationMessageAtom,
  validationRegexAtom,
  validateForm,
} from "../../recoil/UserRecoil";
import { API_BASE_URL } from '../../service/api-config';

function Signup() {
  const resetFormData = useResetRecoilState(formDataAtom);
  const [formData, setFormData] = useRecoilState(formDataAtom);
  const [smessage, setSmessage] = useRecoilState(smessageAtom);
  const [message, setMessage] = useRecoilState(messageAtom);
  const [validationMessage] = useRecoilState(validationMessageAtom); // 메시지 Atom 불러오기
  const [validationRegex] = useRecoilState(validationRegexAtom); // 정규식 Atom 불러오기
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    resetFormData();
  }, [])

  // 기존 객체의 키, 값 형태로 폼데이터 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // 입력값 변경 시 에러 메시지 초기화
    if (name === "userId" || name === "userNick" || name === "userEmail" || name === "userPwd") {
      setSmessage(""); // 서버 관련 에러 초기화
    }
    setMessage(""); // 클라이언트 관련 에러 초기화
  };



  // 회원가입 폼 요청
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.userPwd !== formData.confirmPwd) {
      setMessage('비밀번호가 일치하지 않습니다.')
      return
    }
    // 유효성 검사 실행
    const isValid = validateForm(
      formData,
      validationMessage,
      validationRegex,
      setMessage
    );
    // 유효하지 않을 경우 중단
    if (!isValid) return;
    setIsLoading(true);
    addUser(formData);
    setSmessage("");
  };



  // 회원가입 요청
  const addUser = async (formData) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    try {
      const response = await axios.post(`${API_BASE_URL}/users/signup`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // 인증 토큰 추가
        },
      });
      alert("회원이 추가되었습니다.");
      navigate("/login");
    } catch (error) {
      // 서버에서 받은 에러 메시지 처리
      if (error.response && error.response.data) {
        console.error("회원 추가 오류:", error.response.data);
        setSmessage(error.response.data); // 에러 메시지를 상태로 업데이트
      } else {
        console.error("회원 추가 오류: 알 수 없는 문제 발생");
        setSmessage("회원이 추가되지 않았습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  // 취소 버튼 동작
  const cancelButton = () => {
    setFormData(""); // 폼 데이터 초기화
    setSmessage(""); // 서버 메시지 초기화
    setMessage(""); // 클라이언트 메시지 초기화
    navigate("/"); // 홈으로 이동
  };

  return (
    <div className="signupContainer">
      <span className="signupHeader">회원가입</span>
      <form className="signupForm" onSubmit={handleSubmit}>
        <div className="signupSection">
          <input
            type="text"
            name="userName"
            placeholder="이름"
            value={formData.userName}
            onChange={handleChange}
            className="signupInput"
            disabled={isLoading}
          />
          <input
            type="text"
            name="userId"
            placeholder="아이디"
            value={formData.userId}
            onChange={handleChange}
            className="signupInput"
            disabled={isLoading}
          />
          <input
            type="password"
            name="userPwd"
            placeholder="비밀번호"
            value={formData.userPwd}
            onChange={handleChange}
            className="signupInput"
            disabled={isLoading}
          />
          <input
            type="password"
            name="confirmPwd"
            placeholder="비밀번호 확인"
            value={formData.confirmPwd}
            onChange={handleChange}
            className="signupInput"
            disabled={isLoading}
          />
          <input
            type="text"
            name="userNick"
            placeholder="닉네임"
            value={formData.userNick}
            onChange={handleChange}
            className="signupInput"
            disabled={isLoading}
          />
          <input
            type="email"
            name="userEmail"
            placeholder="이메일"
            value={formData.userEmail}
            onChange={handleChange}
            className="signupInput"
            disabled={isLoading}
          />
        </div>

        <hr className="signupDivider" />

        <div className="signupSection">
          <input
            type="tel"
            name="userPnum"
            placeholder="전화번호 (-)포함 입력"
            value={formData.userPnum}
            onChange={handleChange}
            className="signupInput"
            disabled={isLoading}
          />
          <select
            name="phoneCom"
            value={formData.phoneCom}
            onChange={handleChange}
            className="signupSelect"
            disabled={isLoading}
          >
            <option value="">통신사를 선택하세요</option>
            <option value="SKT">SKT</option>
            <option value="KT">KT</option>
            <option value="LGU+">LGU+</option>
            <option value="SKT알뜰폰">SKT알뜰폰</option>
            <option value="KT알뜰폰">KT알뜰폰</option>
            <option value="LGU+알뜰폰">LGU+알뜰폰</option>
          </select>
        </div>
        <>
          <>
            {message && <p className="errorText">{message}</p>}
            {!message && smessage && <p className="errorText">{smessage}</p>}
          </>
        </>

        <button type="submit" className="signupButton">
          {isLoading ? "처리 중..." : "완료"}
        </button>
        <button type="button" onClick={cancelButton} className="signupButton">
          이전
        </button>
      </form>
    </div>
  );
}

export default Signup;
