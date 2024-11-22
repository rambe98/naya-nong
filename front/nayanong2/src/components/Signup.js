import React, { useState } from "react";
import styled from "styled-components";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5dc; /* 베이지 배경 */
`;

const Logo = styled.img`
  margin-bottom: 20px;
  width: 150px;
  height: auto;
  border-radius: 99px;
  border: 3px solid #8fbc8f; /* 연한 녹색 테두리 */
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 90%; /* 화면에 맞게 폼 너비 조정 */
  max-width: 400px; /* 최대 너비 제한 */
  padding: 20px;
  background-color: #fafad2; /* 옅은 노란색 */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 600px) {
    padding: 15px; /* 작은 화면에서 패딩 감소 */
  }
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #8fbc8f;
  border-radius: 4px;
  background-color: #f5fffa;
  width: 100%;
  box-sizing:border-box;

  &:focus {
    outline: none;
    border-color: #556b2f;
    box-shadow: 0 0 5px rgba(85, 107, 47, 0.5);
  }
`;

const Select = styled.select`
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #8fbc8f;
  border-radius: 4px;
  background-color: #f5fffa;
  width: 100%;
  appearance: none; /* 기본 화살표 제거 */
  -webkit-appearance: none; /* WebKit 브라우저 지원 */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238fbc8f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: calc(100% - 5px) center; /* 오른쪽에서 5px 안쪽 */
  padding-right: 30px; /* 텍스트와 화살표 간격 확보 */

  &:focus {
    outline: none;
    border-color: #556b2f;
    box-shadow: 0 0 5px rgba(85, 107, 47, 0.5);
  }
`;



const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: #6b8e23;
  margin-bottom: 10px;

  &:hover {
    background-color: #556b2f;
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: #8fbc8f;
  margin: 20px 0px;
  margin-top: 0px;
  width: 100%;
`;

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
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
    // 서버 요청 코드 추가 가능

    addUser(formData)
  };

  const addUser = async (formData) => {
    try {
      const response = await axios.post("http://localhost:7070/users", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      console.log("회원추가 성공", response.data)
      alert("회원이 추가되었습니다.")
    } catch (error) {
      console.log("회원 추가 오류")
      alert("회원이 추가되지 않았습니다, 다시 시도해주세요.")
    }
  }


  return (
    <Container>
      <Logo src={logo} alt="Logo" />
      <Form>
        {/* 기본 정보 입력 */}
        <Section>
          <Input
            type="text"
            name="userName"
            placeholder="이름"
            value={formData.userName}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="userId"
            placeholder="아이디"
            value={formData.userId}
            onChange={handleChange}
          />
          <Input
            type="password"
            name="userPwd"
            placeholder="비밀번호"
            value={formData.userPwd}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="userNick"
            placeholder="닉네임"
            value={formData.userNick}
            onChange={handleChange}
          />
          <Input
            type="email"
            name="userEmail"
            placeholder="이메일"
            value={formData.userEmail}
            onChange={handleChange}
          />
        </Section>

        {/* 구분선 */}
        <Divider />

        {/* 연락처 및 통신사 */}
        <Section>
          <Input
            type="tel"
            name="userPnum"
            placeholder="전화번호 (-)포함 입력"
            value={formData.userPnum}
            onChange={handleChange}
          />
          <Select
            name="userTelecom"
            value={formData.userTelecom}
            onChange={handleChange}
          >
            <option value="">통신사를 선택하세요</option>
            <option value="SKT">SKT</option>
            <option value="KT">KT</option>
            <option value="LGU+">LGU+</option>
            <option value="SKT알뜰폰">SKT알뜰폰</option>
            <option value="KT알뜰폰">KT알뜰폰</option>
            <option value="LGU+알뜰폰">LGU+알뜰폰</option>
          </Select>
        </Section>

        {/* 완료 및 이전 버튼 */}
        <Button type="button" onClick={handleSubmit}>완료</Button>
        <Button type="button" onClick={() => navigate("/")}>
          이전
        </Button>
      </Form>
    </Container>
  );
}

export default Signup;
