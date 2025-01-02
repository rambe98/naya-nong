import React, { useState, useEffect } from 'react';
import '../../css/Login.css';
import logo from '../../assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { signin } from '../../service/ApiService'



function Login() {
  //네비게이트
  const navigate = useNavigate();
  //현재 브라우저의 위치 정보를 가져온다.
  const location = useLocation();
  //사용자에게 아이디를 입력받는 상태관리
  const [userId, setUserId] = useState('');
  //사용자에게 비밀번호를 입력받는 상태관리
  const [userPwd, setUserPwd] = useState('');
  //사용자에게 보여질 메시지 상태관리
  const [message, setMessage] = useState('');
  //로딩 상태관리
  const [isLoading, setIsLoading] = useState(false);


  // 컴포넌트 언마운트 시 메시지 초기화
  useEffect(() => {
    return () => {
      setMessage('');
    };
  }, []);

  // 뒤로가기(이전) 버튼
  const handleBack = () => {
    setUserId('');  //유저아이디 초기화
    setUserPwd(''); //유저비밀번호 초기화
    setMessage(''); //메시지 초기화
    navigate('/');  // 이전 경로로 이동
  };

  //로그인 요청
  const handleLogin = async (e) => {
    // 버튼이 눌렸을 때 새로고침이나 기본 동작이 실행되지 않게 막아줌
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

    //로그인 요청에 사용될 데이터
    const logindata = {
      userId: userId,
      userPwd: userPwd,
    };

    try {
      // 서버로 로그인 요청을 보내고 응답 데이터를 받아옴
      const response = await signin(logindata);

      if (response.token) {
        // 로그인 성공 처리
        setUserPwd('');
        alert('로그인 성공');

        // 리다이렉트할 경로를 설정: 이전 경로가 있으면 그 경로로, 없으면 홈('/')으로 이동
        // *리다이렉트 : 사용자가 특정 페이지에 접근할 때 조건에 따라 다른 페이지로 이동
        // 현재 나야, 농 프로젝트는 QnA, Write 컴포넌트에 조건이 있다.
        // ex) QnA 페이지에 접속할시 로그인을 필요로 하는데 확인버튼을 눌러 로그인페이지로 이동이되서
        // 로그인을 했을 경우 QnA페이지로 돌아옴 <- 이것을 이전 경로라 함
        const redirectPath = location.state?.from || '/';
        navigate(redirectPath);
      } else {
        // 서버에서 반환된 에러 메시지 설정
        setMessage('아이디 또는 비밀번호가 잘못되었습니다.');
      }
    } catch (error) {
      //401 에러가 주로 아이디 & 비밀번호가 잘못된 경우에 발생생
      if (error.response && error.response.status === 401) {
        // 401 Unauthorized: 아이디 또는 비밀번호 틀림
        setMessage('아이디 또는 비밀번호가 잘못되었습니다.');
      } else {
        // 401에러를 제외한 서버에러 처리리
        console.error('로그인 실패:', error);
        setMessage('일시적인 문제가 발생했습니다. \n잠시 후 다시 시도해주세요.');
      }
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
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="비밀번호 입력"
            autoComplete="off"
            value={userPwd}
            onChange={(e) => setUserPwd(e.target.value)}
            className="loginInput"
            disabled={isLoading}
          />
          {message && <p className="loginerrorText">{message}</p>}
          <button type="submit" className="loginButton" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
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
