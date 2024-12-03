import React, {useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../css/Main.css'
import { useRecoilValue, useResetRecoilState, useSetRecoilState, useRecoilState} from 'recoil';
import { clientNumAtom, loginsuccessAtom, messageAtom, userIdAtom, userPwdAtom, formDataAtom, userNickSelector } from '../recoil/UserRecoil';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //loginsuccess에 loginsuccessAtom의 값을 읽어와 loginsuccess변수에 저장 (true, false가 저장됨)
  const loginsuccess = useRecoilValue(loginsuccessAtom);
  //loginsuccessAtom에 저장된 값으로 setLoginSuccess 업데이트 (true=로그인됨, false=로그아웃)
  const setLoginSuccess = useSetRecoilState(loginsuccessAtom);
  //clientNumAtom에서 현재 클라이언트번호를 읽어와 clientNum변수에 저장
  const clientNum = useRecoilValue(clientNumAtom);
  const [userNick, setUserNick] = useRecoilState(userNickSelector);



  //로그아웃시 로그인 인풋에 남아있는 값 디폴트값으로 초기화 하기위해 상태초기화함수 가져왔다
  const resetUserId = useResetRecoilState(userIdAtom);
  const resetUserPwd = useResetRecoilState(userPwdAtom);
  const resetMessage = useResetRecoilState(messageAtom);
  const resetFormData = useResetRecoilState(formDataAtom);

  // useEffect(() => {
  //   const localUserNick = localStorage.getItem("userNick");
  //   if (localUserNick && localUserNick !== userNick) {
  //     setUserNick(localUserNick); // 로컬 스토리지와 상태 동기화
  //   }
  // }, [userNick, setUserNick]);
  

  //로그아웃 함수
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

  //정보수정 이동함수
  const handleLogInfo = () => {
    if (clientNum) {
      // clientNum을 가지고 사용자 정보 페이지로 이동
      navigate(`/userinfo/${clientNum}`);
    } else {
      alert('로그인 정보가 없습니다. 다시 로그인 해주세요.');
    }
  };

  return (
    <header className="mainHeader">
      <div className="mainHeaderLeft">
        <img src={logo} alt="Logo" className="mainLogo" onClick={() => navigate('/')} />
        <h2 className='logoText '>나야, 농</h2>
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
      {loginsuccess && <span className='HeaderHello'>환영합니다<br/> {userNick}님</span>}

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
