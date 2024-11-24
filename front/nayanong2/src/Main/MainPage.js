import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../MainCss/MainPage.css';
import MainHeader from './MainHeader';


const MainPage = () => {
    const navigate = useNavigate();

  return (
    <div className="mainContainer">
        <MainHeader/>

      {/* 네비게이션 */}
      <nav className="mainNav">
        <Link to="/api" className="navLink">
          메인 API
        </Link>
        <Link to="/board" className="navLink">
          게시판
        </Link>
        <Link to="/qna" className="navLink">
          Q&A
        </Link>
      </nav>
    </div>
  );
};

export default MainPage;
