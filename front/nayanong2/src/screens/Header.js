import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../css/Main.css';
import { useResetRecoilState } from "recoil";
import { userIdAtom, userPwdAtom } from '../recoil/UserRecoil';

const Header = () => {
  //네비게이트 선언
  const navigate = useNavigate();
  //로케이션 선언(현재 사용자가 어떤 경로에 있는지 알기 위해 사용한다. URL과 관련된 정보 제공)
  const location = useLocation();
  //현재 헤더가 보이는 상태인지 숨겨져있는 상태인지를 나타내는 상태관리(로그인화면에서 숨겨짐)
  const [isVisible, setIsVisible] = useState(true);

  // 로컬스토리지에서 로그인 상태 및 사용자 정보 가져오기
  // loginsuccess는 로컬스토리지에 토큰이 있으면 true 없으면 false 저장
  const loginsuccess = localStorage.getItem("ACCESS_TOKEN") ? true : false;
  const userNick = localStorage.getItem("userNick");
  //userId의 Recoil상태를 초기값으로 재설정한다.
  const resetUserId = useResetRecoilState(userIdAtom);
  //userPwd의 Recoil상태를 초기값으로 재설정한다.
  const resetUserPwd = useResetRecoilState(userPwdAtom);

  // 로그아웃 함수
  const handleLogout = () => {
    //로그아웃 시 userId를 초기값으로 재설정
    resetUserId();
    //로그아웃 시 userPwd를 초기값으로 재설정
    resetUserPwd();
    //로그아웃 시 로컬스토리지의 토큰, 로그인정보, 클라이언트넘, 유저닉, 유저아이디 삭제
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("loginsuccess");
    localStorage.removeItem("clientNum");
    localStorage.removeItem("userNick");
    localStorage.removeItem('userId');
    alert('로그아웃 되었습니다.');
    //로그아웃 시 메인으로 이동
    navigate('/');
  };

  // 정보 수정 이동 함수
  const handleLogInfo = () => {
    //clientNum변수에 로컬스토리지에 저장되있는 clientNum을 저장한다.
    const clientNum = localStorage.getItem("clientNum");
    // clientNum이 있으면 /userinfo/${clientNum}으로 이동 없으면 문구띄움
    if (clientNum) {
      navigate(`/userinfo/${clientNum}`);
    } else {
      alert('로그인 정보가 없습니다. 다시 로그인 해주세요.');
    }
  };

  // 스크롤 이벤트 처리
  useEffect(() => {
    //마지막 스크롤위치를 저장 (기본값= 0)
    let lastScrollTop = 0;

    const handleScroll = () => {
      //currentScroll이란 변수에 문서상단에서 현재 스크롤된 픽셀값을 반환받음
      const currentScroll = window.pageYOffset;
      //현재 스크롤된 픽셀값이 마지막 스크롤위치보다 크거나 50보다 크면
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
