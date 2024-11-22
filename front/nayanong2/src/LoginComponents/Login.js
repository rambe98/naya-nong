import React, { useState } from 'react';
import '../LoginCss/Login.css';
import logo from '../assets/logo.jpg';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [userId, setUserId] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('ID:', userId, 'Password:', userPwd);
  };

  return (
    <div className="loginContainer">
      <img src={logo} alt="Logo" className="loginLogo" />
      <form onSubmit={handleLogin} className="loginForm">
        <input
          type="text"
          placeholder="아이디 입력"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="loginInput"
        />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={userPwd}
          onChange={(e) => setUserPwd(e.target.value)}
          className="loginInput"
        />
        <button type="submit" className="loginButton">로그인</button>
      </form>
      <div className="loginLinkContainer">
        <button className="loginLinkButton">아이디/비밀번호 찾기</button>
        <button className="loginLinkButton" onClick={() => navigate('/signup')}>회원가입</button>
      </div>
    </div>
  );
}

export default Login;
