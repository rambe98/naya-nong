import React, { useState, useEffect} from 'react';
import '../../css/Login.css'
import logo from '../../assets/logo.png'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { clientNumAtom,loginsuccessAtom, messageAtom, userIdAtom, userPwdAtom, userNicksuccessAtom } from '../../recoil/UserRecoil';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useRecoilState(userIdAtom);
  const [userPwd, setUserPwd] = useRecoilState(userPwdAtom);
  const [message, setMessage] = useRecoilState(messageAtom);
  const setLoginSuccess = useSetRecoilState(loginsuccessAtom);
  const setClientNum = useSetRecoilState(clientNumAtom);
  const setUserNick = useSetRecoilState(userNicksuccessAtom);

    //로그인 페이지에 html(최상위) css 적용
    useEffect(() => {
      // body에 클래스 추가
      document.body.classList.add('no-scroll');
  
      // 언마운트 시 클래스 제거
      return () => {
        document.body.classList.remove('no-scroll');
      };
    }, []);

  //뒤로가기
  const handleBack = () => {
    setUserId('');
    setUserPwd('');
    setMessage('');
    navigate('/'); // 이전 경로로 이동
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // 아이디 및 비밀번호 검증
    if (!userId.trim() || !userPwd.trim()) {
      setMessage('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    // 아이디 및 비밀번호 공백 검증
    if (userId.includes(' ') || userPwd.includes(' ')) {
      setMessage('아이디와 비밀번호는 공백을 포함할 수 없습니다.');
      return;
    }

    // 에러 초기화
    setMessage('');

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

        // 세션 스토리지에 상태 저장
        sessionStorage.setItem('loginsuccess', 'true');
        sessionStorage.setItem('userId', user.userId);
        sessionStorage.setItem('clientNum', user.clientNum);
        sessionStorage.setItem('userNick', user.userNick);

        // 부모 상태 업데이트
        setLoginSuccess(true);
        setClientNum(user.clientNum);
        setUserNick(user.userNick)
        setUserPwd('');
        alert('로그인 성공');

        // 이전 경로로 리다이렉트
        const redirectPath = location.state?.from || '/';
        navigate(redirectPath);
        
      } else {
        throw new Error('Unexpected response status: ' + response.status);
      }
    } catch (error) {
      console.error('로그인 실패:', message);
      setMessage('로그인에 실패했습니다.\n 다시 시도해주세요.');
    }
  };

  return (
    <div className="loginContainer">
  <div className="loginContent">
    <img
      src={logo}
      alt="Logo"
      className="mainLogo"
      onClick={() => navigate('/')}
    />
    <h2 className="loginH2">로 그 인</h2>
    <form className="loginForm" onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="아이디 입력"
        value={userId}
        autoComplete="off"
        onChange={(e) => setUserId(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleLogin(e);
          }
        }}
        className="loginInput"
      />
      <input
        type="password"
        placeholder="비밀번호 입력"
        autoComplete="off"
        value={userPwd}
        onChange={(e) => setUserPwd(e.target.value)}
        className="loginInput"
      />
      {message && <p className="loginerrorText">{message}</p>}
      <button type="submit" className="loginButton">
        로그인
      </button>
      <button type="button" className="loginButton" onClick={handleBack}>
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
</div>

  );
}

export default Login;
