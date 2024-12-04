import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../css/Main.css';
import {
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
  useRecoilState,
} from 'recoil';
import {
  clientNumAtom,
  loginsuccessAtom,
  messageAtom,
  userIdAtom,
  userPwdAtom,
  formDataAtom,
  userNickSelector,
} from '../recoil/UserRecoil';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const loginsuccess = useRecoilValue(loginsuccessAtom);
  const setLoginSuccess = useSetRecoilState(loginsuccessAtom);
  const clientNum = useRecoilValue(clientNumAtom);
  const [userNick, setUserNick] = useRecoilState(userNickSelector);

  const resetUserId = useResetRecoilState(userIdAtom);
  const resetUserPwd = useResetRecoilState(userPwdAtom);
  const resetMessage = useResetRecoilState(messageAtom);
  const resetFormData = useResetRecoilState(formDataAtom);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 스크롤 상태 감지
  const handleScroll = () => {
    if (window.scrollY > lastScrollY && window.scrollY > 80) {
      setIsVisible(false); // 스크롤 다운 시 헤더 숨기기
    } else {
      setIsVisible(true); // 스크롤 업 시 헤더 보이기
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    setLoginSuccess(false);
    sessionStorage.removeItem('loginsuccess');
    sessionStorage.removeItem('clientNum');
    sessionStorage.removeItem('userNick');
    sessionStorage.removeItem('userId');
    resetUserId();
    resetUserPwd();
    resetMessage();
    resetFormData();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  const handleLogInfo = () => {
    if (clientNum) {
      navigate(`/userinfo/${clientNum}`);
    } else {
      alert('로그인 정보가 없습니다. 다시 로그인 해주세요.');
    }
  };

  return (
    <header className={`mainHeader ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="mainHeaderLeft">
        <img src={logo} alt="Logo" className="mainLogo" onClick={() => navigate('/')} />
        <h2 className="logoText" onClick={() => navigate('/')}>나야, 농</h2>
      </div>
      <nav className="mainHeaderNav">
        <ul>
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">도·소매가 정보</Link>
          </li>
          <li className={location.pathname === '/board' ? 'active' : ''}>
            <Link to="/board">게시판</Link>
          </li>
          <li className={location.pathname === '/qna' ? 'active' : ''}>
            <Link to="/qna">QnA</Link>
          </li>
        </ul>
      </nav>
      <div className="mainHeaderRight">
        {loginsuccess && (
          <span className="HeaderHello">
            환영합니다<br />
            <span className="highlight">{userNick}</span>님
          </span>
        )}
        {!loginsuccess ? (
          <>
            <button className="mainButton" onClick={() => navigate('/login')}>로그인</button>
            <button className="mainButton" onClick={() => navigate('/signup')}>회원가입</button>
          </>
        ) : (
          <>
            <button className="mainButton" onClick={handleLogInfo}>회원수정</button>
            <button className="mainButton" onClick={handleLogout}>로그아웃</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
