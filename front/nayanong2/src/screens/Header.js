import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../css/Main.css';
import { useResetRecoilState } from "recoil";
import { userIdAtom, userPwdAtom } from '../recoil/UserRecoil';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true); // 헤더의 visibility 상태 관리

  // 로컬스토리지에서 로그인 상태 및 사용자 정보 가져오기
  const loginsuccess = localStorage.getItem("ACCESS_TOKEN") ? true : false;
  const userNick = localStorage.getItem("userNick");
  const resetUserId = useResetRecoilState(userIdAtom);
  const resetUserPwd = useResetRecoilState(userPwdAtom);

  // 로그아웃 함수
  const handleLogout = () => {
    resetUserId();
    resetUserPwd();
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("loginsuccess");
    localStorage.removeItem("clientNum");
    localStorage.removeItem("userNick");
    localStorage.removeItem('userId');
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  // 정보 수정 이동 함수
  const handleLogInfo = () => {
    const clientNum = localStorage.getItem("clientNum");
    if (clientNum) {
      navigate(`/userinfo/${clientNum}`);
    } else {
      alert('로그인 정보가 없습니다. 다시 로그인 해주세요.');
    }
  };

  // 스크롤 이벤트 처리
  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > lastScrollTop && currentScroll > 50) {
        // 스크롤 내리면 헤더 숨기기
        setIsVisible(false);
      } else {
        // 스크롤 올리면 헤더 보이기
        setIsVisible(true);
      }
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`mainHeader ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="mainHeaderLeft">
        <img src={logo} alt="Logo" className="mainLogo" onClick={() => navigate('/')} />
        <h2 className='logoText' onClick={() => navigate('/')}>나야, 농</h2>
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
            <button className="mainButton" onClick={() => navigate('/login')}>
              로그인
            </button>
            <button className="mainButton" onClick={() => navigate('/signup')}>
              회원가입
            </button>
          </>
        ) : (
          <>
            <button className="mainButton" onClick={handleLogInfo}>
              회원수정
            </button>
            <button className="mainButton" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
