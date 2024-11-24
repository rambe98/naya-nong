import React, { useState } from "react";
import "../LoginCss/Signup.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    userId: "",
    userPwd: "",
    userNick: "",
    userEmail: "",
    userPnum: "",
    userTelecom: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("회원가입 정보:", formData);
    addUser(formData);
  };

  //회원가입
  const addUser = async (formData) => {
    //회원가입시 모든 정보를 입력해야 가입 가능
    if (formData.userName.trim() === "") {
      alert("이름을 입력해주세요.");
      return false;
    } else if (formData.userId.trim() === "") {
      alert("아이디를 입력해주세요.");
      return false;
    } else if (formData.userPwd.trim() === "") {
      alert("비밀번호를 입력해주세요.");
      return false;
    } else if (formData.userNick.trim() === "") {
      alert("닉네임을 입력해주세요.");
      return false;
    } else if (formData.userEmail.trim() === "") {
      alert("이메일을 입력해주세요.");
      return false;
    } else if (formData.userPnum.trim() === "") {
      alert("전화번호를 입력해주세요.");
      return false;
    } else if (formData.userTelecom.trim() === "") {
      alert("통신사를 선택해주세요.");
      return false;
    }
    try {
      const response = await axios.post("http://localhost:7070/users", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("회원추가 성공", response.data);
      alert("회원이 추가되었습니다.");
      navigate("/")
    } catch (error) {
      console.log("회원 추가 오류");
      alert("회원이 추가되지 않았습니다, 다시 시도해주세요.");
    }
  };

  return (
    <div className="signupContainer">
      <img src={logo} alt="Logo" className="signupLogo" />
      <span className="signupHeader">회원가입</span>
      <form className="signupForm">
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
            name="userTelecom"
            value={formData.userTelecom}
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

        <button type="button" onClick={handleSubmit} className="signupButton">
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
