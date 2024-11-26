import React, { useState } from 'react';
import '../LoginCss/Login.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [userId, setUserId] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [clientNum, setClientNum] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();



  const handleLogin = async (e) => {
    e.preventDefault();

    // 아이디 검증
    if (!userId.trim()) {
      setError('아이디를 입력해주세요.');
      return;
    }

    //비밀번호 검증
    if(!userPwd.trim()){
      setError('비밀번호를 입력해주세요.')
      return;
    }

    // 중간 공백 검증
    if (userId.includes(' ') || userPwd.includes(' ')) {
      setError('아이디와 비밀번호는 공백을 포함할 수 없습니다.');
      return;
    }

    // 에러 초기화
    setError('');

    const logindata = {
      userId: userId.trim(),
      userPwd: userPwd.trim(),
    };

    try {
      const response = await axios.post(`http://localhost:7070/login`, logindata);

      if (response.status === 200 && response.data.token) {
        // 성공 처리
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', userId.trim());
        navigate(`/`);
      } else {
        setError('로그인 실패: 서버로부터 유효한 응답이 없습니다.');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setError('로그인에 실패했습니다.\n 아이디와 비밀번호를 확인해주세요.');
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
        {error && <p className="loginerrorText" >{error}</p>}
        <button type="button" className="loginButton" onClick={handleLogin}>로그인</button>
        <button type="button" className="loginButton" onClick={() => navigate('/')}>이전</button>
      </form>
      <div className="loginLinkContainer">
        <button type='button' className="loginLinkButton" onClick={() => navigate('/finduserId')}>아이디/비밀번호 찾기</button>
        <button type='button' className="loginLinkButton" onClick={() => navigate('/signup')}>회원가입</button>
      </div>
    </div>
  );
}

export default Login;
