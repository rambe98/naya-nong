import React, { useState} from 'react';
import '../LoginCss/Login.css';
import logo from '../assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Login({ setLoginSuccess, setClientNum }) {
  const [userId, setUserId] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();


  
  const handleLogin = async (e) => {
    e.preventDefault();

    // 아이디 및 비밀번호 검증
    if (!userId.trim() || !userPwd.trim()) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    // 아이디 및 비밀번호 공백 검증
    if (userId.includes(' ') || userPwd.includes(' ')) {
      setError('아이디와 비밀번호는 공백을 포함할 수 없습니다.');
      return;
    }

    // 에러 초기화
    setError('');

    const logindata = {
      userId : userId,
      userPwd: userPwd,
    };

    try {
      const response = await axios.post('http://localhost:7070/users/signin', logindata, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status >= 200 && response.status < 300) {
        const user = response.data;

        // 로컬 스토리지에 상태 저장
        localStorage.setItem('loginsuccess', 'true');
        localStorage.setItem('userId', user.userId);
        localStorage.setItem('clientNum', user.clientNum);

        // 부모 상태 업데이트
        setLoginSuccess(true);
        setClientNum(user.clientNum);

        alert('로그인 성공');

        // 이전 경로로 리다이렉트
        const redirectPath = location.state?.from || '/';
        navigate(redirectPath);
      } else {
        throw new Error('Unexpected response status: ' + response.status);
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setError('로그인에 실패했습니다.\n 다시 시도해주세요.');
    }
  };

  return (
    <div className="loginContainer">
      <h2 className="loginH2">로 그 인</h2>
      <form
        className="loginForm"
        onSubmit={handleLogin} // 폼 제출 이벤트 처리
      >
        <input
          type="text"
          placeholder="아이디 입력"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // 기본 동작 방지
              handleLogin(e); // 로그인 처리 함수 호출
            }
          }}
          className="loginInput"
        />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={userPwd}
          onChange={(e) => setUserPwd(e.target.value)}
          className="loginInput"
        />
        {error && <p className="loginerrorText">{error}</p>}
        <button
          type="submit" // 폼 제출 버튼
          className="loginButton"
        >
          Login
        </button>
        <button
          type="button"
          className="loginButton"
          onClick={() => navigate('/')}
        >
          이전
        </button>
      </form>
      <div className="loginLinkContainer">
        <button
          type="button"
          className="loginLinkButton"
          onClick={() => navigate('/finduserId')}
        >
          아이디/비밀번호 찾기
        </button>
        <button
          type="button"
          className="loginLinkButton"
          onClick={() => navigate('/signup')}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Login;
