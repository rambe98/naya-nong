import React, { useState } from "react";
import '../../css/Signup.css'
import logo from '../../assets/logo.png'
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {

  const [smessage, setSmessage] = useState('');
  const [message, setMessage] = useState('')

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    userId: "",
    userPwd: "",
    userNick: "",
    userEmail: "",
    userPnum: "",
    phoneCom: "",
  });

  //기존 객체의 키,값 형태로 폼데이터 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

     // 입력값 변경 시 에러 메시지 초기화
  if (name === "userId" || name === "userNick" || name === "userEmail") {
    setSmessage(""); // 서버 관련 에러 초기화
  }
  setMessage(""); // 클라이언트 관련 에러 초기화
    
  };

  //폼제출
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("회원가입 정보:", formData);
    addUser(formData);
    setSmessage("");;
    
  };

  //회원가입
  const addUser = async (formData) => {
    //회원가입시 모든 정보를 입력해야 가입 가능
    const validationMessage = {
      userName: "이름을 입력해주세요.",
      userId: "아이디를 입력해주세요. (영문자와 숫자만 가능,4~20자)",
      userPwd: "비밀번호를 입력해주세요. (영문자,숫자,특수문자 포함 6~20자)",
      userNick: "닉네임을 입력해주세요.",
      userEmail: "이메일을 입력해주세요.",
      userPnum: "전화번호를 입력해주세요.",
      phoneCom: "통신사를 선택해주세요.",
    }



    //이름 정규식, 한글로만 이루어진 이름을 2자 이상 20자 이하로 제한하는 조건
    const userNameRegex = /^[가-힣]{2,20}$/
    //아이디 정규식 , 영문자와 숫자만 포함된 문자열이며, 길이가 4자 이상 20자 이하인 문자열
    const userIdRegex = /^[a-zA-Z0-9]{4,20}$/
    //비밀번호 정규식, 영어 대소문자, 숫자, 특수문자(7~20자)
    const userPwdRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{5,20}$/
    //이메일 정규식
    const userEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    for (let key in validationMessage) {
      if (!formData[key] || formData[key].trim() === "") {
        setMessage(validationMessage[key])
        return false
      }

      //이름 유효성 검사
      if (key === 'userName' && !userNameRegex.test(formData[key])) {
        setMessage(validationMessage[key])
        return false
      }
      //아이디 유효성 검사
      if (key === 'userId' && !userIdRegex.test(formData[key])) {
        setMessage(validationMessage[key])
        return false
      }
      //비밃번호 유효성 검사
      if (key === 'userPwd' && !userPwdRegex.test(formData[key])) {
        setMessage(validationMessage[key])
        return false
      }
      //이메일 유효성 검사
      if (key === 'userEmail' && !userEmailRegex.test(formData[key])) {
        setMessage(validationMessage[key])
        return false
      }
    }
    try {
      const response = await axios.post("http://localhost:7070/users/signup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("회원추가 성공", response.data);
      alert("회원이 추가되었습니다.");
      navigate("/")
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("회원 추가 오류:", error.response.data);
        setSmessage(error.response.data); // 에러 메시지를 상태로 업데이트
      } else {
        console.error("회원 추가 오류: 알 수 없는 문제 발생");
        setSmessage("회원이 추가되지 않았습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="signupContainer">
      <img src={logo} alt="Logo" className="signupLogo" />
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
          />
          <input
            type="text"
            name="userId"
            placeholder="아이디"
            value={formData.userId}
            onChange={handleChange}
            className="signupInput"
          />
          <input
            type="password"
            name="userPwd"
            placeholder="비밀번호"
            value={formData.userPwd}
            onChange={handleChange}
            className="signupInput"
          />
          <input
            type="text"
            name="userNick"
            placeholder="닉네임"
            value={formData.userNick}
            onChange={handleChange}
            className="signupInput"
          />
          <input
            type="email"
            name="userEmail"
            placeholder="이메일"
            value={formData.userEmail}
            onChange={handleChange}
            className="signupInput"
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
          />
          <select
            name="phoneCom"
            value={formData.phoneCom}
            onChange={handleChange}
            className="signupSelect"
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
          완료
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="signupButton"
        >
          이전
        </button>
      </form>
    </div>
  );
}

export default Signup;
