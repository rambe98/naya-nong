import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../MainCss/Main.css';

const Main = ({ loginsuccess, handleLogInfo, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // const handleloginClick = () => {

  //   navigate('/login')
  // }

  return (
    <header className="mainHeader">
      <div className="mainHeaderLeft">
        <img src={logo} alt="Logo" className="mainLogo" onClick={() => navigate('/')} />
        <h2 className='logoText '>나야, 농</h2>
      </div>
      <nav className="mainHeaderNav">
        <ul>
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">Home</Link>
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
        {!loginsuccess ? (
          <>
            <button className="mainButton">
              로그인
            </button>
            <button className="mainButton" onClick={() => navigate('/signup')}>
              회원가입
            </button>
          </>
        ) : (
          <>
            <button className="mainButton" onClick={() => handleLogInfo(navigate)}>
              UserInfo
            </button>
            <button className="mainButton" onClick={() => handleLogout(navigate)}>
              SignOut
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Main;
