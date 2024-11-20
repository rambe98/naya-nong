import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.jpg';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: center;
  background-color: #F5F5DC; /* 베이지색 배경 */
`;

const Logo = styled.img`
  margin-bottom: 20px;
  width: 150px;
  height: auto;
  border-radius: 99px;
  border: 3px solid #8FBC8F; /* 연한 녹색 테두리 */
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  background-color: #FAFAD2; /* 옅은 노란색 배경 */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #8FBC8F; /* 연한 녹색 */
  border-radius: 4px;
  background-color: #F5FFFA; /* 민트색 배경 */
  
  &:focus {
    outline: none;
    border-color: #556B2F; /* 짙은 올리브색 */
    box-shadow: 0 0 5px rgba(85, 107, 47, 0.5);
    background-color: #FFF8DC; /* 옅은 크림색 */
  }
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #6B8E23; /* 올리브그린 */
  color: white;
  border: none;
  border-radius: 5px;

  &:hover {
    background-color: #556B2F; /* 짙은 올리브색 */
  }
`;

const LinkContainer = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  width: 300px;
`;

const LinkButton = styled.button`
  font-size: 14px;
  cursor: pointer;
  background: none;
  border: none;
  color: #6B8E23; /* 올리브그린 */
  text-decoration: underline;

  &:hover {
    text-decoration: none;
    color: #556B2F; /* 짙은 올리브색 */
  }
`;

function Login() {
  const [userId, setUserId] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('ID:', userId, 'Password:', userPwd);
  };

  return (
    <Container>
      <Logo src={logo} alt="Logo" />
      <Form onSubmit={handleLogin}>
        <Input
          type="text"
          placeholder="아이디 입력"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호 입력"
          value={userPwd}
          onChange={(e) => setUserPwd(e.target.value)}
        />
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        <LinkButton>아이디/비밀번호 찾기</LinkButton>
        <LinkButton
        onClick={() => navigate('/signup')}>회원가입</LinkButton>
      </LinkContainer>
    </Container>
  );
}

export default Login;
