import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../css/Main.css';
import { useResetRecoilState, useRecoilValue } from "recoil";
import { userIdAtom, userPwdAtom } from '../recoil/UserRecoil';
import { scrollAtom } from '../recoil/ScrollRecoil';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // 모바일 메뉴 상태 관리
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // 모바일 여부 확인
  const scrollPosition = useRecoilValue(scrollAtom); // Recoil 상태 구독
  const isVisible = scrollPosition < 80; // 스크롤이 80 이상이면 숨김

  // 로컬스토리지에서 로그인 상태 및 사용자 정보 가져오기
  const loginsuccess = localStorage.getItem("ACCESS_TOKEN") ? true : false;
  const userNick = localStorage.getItem("userNick");
  const resetUserId = useResetRecoilState(userIdAtom);
  const resetUserPwd = useResetRecoilState(userPwdAtom);

  // 768px 이상넘어가면 햄버거아이콘 사라짐
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setMobileMenuOpen(false); // 화면 크기 변경 시 모바일 메뉴 닫기
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 스크롤 감지하여 모바일 메뉴 닫기
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen && scrollPosition >= 80) {
        setMobileMenuOpen(false);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen, scrollPosition]);

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


  return (
    <header className={`Header_mainHeader ${isVisible ? 'Header_show' : 'Header_hide'}`}>
      <div className="Header_mainHeaderLeft">
        <img src={logo} alt="Logo" className="Header_mainLogo" onClick={() => navigate('/')} />
        <h2 className="Header_logoText" onClick={() => navigate('/')}>나야, 농</h2>
      </div>

      {/* 웹페이지: 네비게이션 */}
      {!isMobile && (
        <nav className="Header_mainHeaderNav">
          <ul>
            <li className={location.pathname === '/' ? 'Header_active' : ''}>
              <Link to="/">도·소매가 정보</Link>
            </li>
            <li className={location.pathname === '/board' ? 'Header_active' : ''}>
              <Link to="/board">게시판</Link>
            </li>
            <li className={location.pathname === '/qna' ? 'Header_active' : ''}>
              <Link to="/qna">QnA</Link>
            </li>
          </ul>
        </nav>
      )}

      {/* 웹페이지: 로그인/회원가입 버튼 */}
      {!isMobile && (
        <div className="Header_mainHeaderRight">
          {loginsuccess ? (
            <>
              <div className="Header_HeaderHello">
                환영합니다<br />
                <span className="Header_highlight">{userNick}</span>님
              </div>
              <button className="Header_mainButton" onClick={handleLogInfo}>회원수정</button>
              <button className="Header_mainButton" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <button className="Header_mainButton" onClick={() => navigate('/login')}>로그인</button>
              <button className="Header_mainButton" onClick={() => navigate('/signup')}>회원가입</button>
            </>
          )}
        </div>
      )}

      {/* 햄버거 버튼: 모바일에서만 표시, 네비게이션이 열리면 숨김 */}
      {isMobile && !isMobileMenuOpen && (
        <div
          className="Header_hamburgerMenu"
          onClick={() => setMobileMenuOpen(true)}
        >
          ☰
        </div>
      )}



      {/* 모바일 네비게이션 */}
      {isMobile && (
        <nav className={`Header_mobileNav ${isMobileMenuOpen ? 'active' : 'inactive'}`}>
          {loginsuccess && (
            <div className="Header_HeaderHello">
              환영합니다<br />
              <span className="Header_highlight">{userNick}</span>님
            </div>
          )}
          <div
            className="Header_closeButton"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✕
          </div>
          <ul>
            <li
              className={location.pathname === '/' ? 'Header_active' : ''}
              onClick={() => setMobileMenuOpen(false)} // 링크 클릭 시 메뉴 닫기
            >
              <Link to="/">도·소매가 정보</Link>
            </li>
            <li
              className={location.pathname === '/board' ? 'Header_active' : ''}
              onClick={() => setMobileMenuOpen(false)} // 링크 클릭 시 메뉴 닫기
            >
              <Link to="/board">게시판</Link>
            </li>
            <li
              className={location.pathname === '/qna' ? 'Header_active' : ''}
              onClick={() => setMobileMenuOpen(false)} // 링크 클릭 시 메뉴 닫기
            >
              <Link to="/qna">QnA</Link>
            </li>
          </ul>

          <div className="Header_mobileButtons">
            {!loginsuccess ? (

              <>
                <button
                  className="Header_mainButton"
                  onClick={() => {
                    setMobileMenuOpen(false); // 메뉴 닫기
                    navigate('/login');
                  }}
                >
                  로그인
                </button>
                <button
                  className="Header_mainButton"
                  onClick={() => {
                    setMobileMenuOpen(false); // 메뉴 닫기
                    navigate('/signup');
                  }}
                >
                  회원가입
                </button>
              </>
            ) : (
              <>
                <button
                  className="Header_mainButton"
                  onClick={() => {
                    setMobileMenuOpen(false); // 메뉴 닫기
                    handleLogInfo();
                  }}
                >
                  회원수정
                </button>
                <button
                  className="Header_mainButton"
                  onClick={() => {
                    setMobileMenuOpen(false); // 메뉴 닫기
                    handleLogout();
                  }}
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
