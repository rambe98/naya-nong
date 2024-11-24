import React, { useState } from 'react';
import '../LoginCss/Login.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [userId, setUserId] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [clientNum, setClientNum] = useState(0);
  const navigate = useNavigate();



  const handleLogin = async (e) => {
    e.preventDefault();
    const logindata = {
      userId: userId,
      userPwd: userPwd,
    };
  
    try {
      const response = await axios.post(`http://localhost:7070/users`, logindata);
  
      if (response.status === 200 && response.data.clientNum) {
        alert('로그인 성공');
        console.log('로그인 성공', response.data);
  
        // 서버에서 받은 clientNum을 localStorage에 저장
        localStorage.setItem('loginsuccess', 'true');
        localStorage.setItem('userId', userId);
        localStorage.setItem('clientNum', response.data.clientNum); // 서버에서 받은 clientNum 저장
  
        // 로그인 성공 후 userinfo 페이지로 이동
        navigate(`/`);
      }
  
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    }
  };
  


  return (
    <div className="loginContainer">
      <img src={logo} alt="Logo" className="loginLogo" />
      <form className="loginForm">
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
        <button type="button" className="loginButton" onClick={handleLogin}>로그인</button>
        <button type="button" className="loginButton" onClick={() => navigate('/')}>이전</button>
      </form>
      <div className="loginLinkContainer">
        <button type='button' className="loginLinkButton">아이디/비밀번호 찾기</button>
        <button type='button' className="loginLinkButton" onClick={() => navigate('/signup')}>회원가입</button>
      </div>
    </div>
  );
}

export default Login;
