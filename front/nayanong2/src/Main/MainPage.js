import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../MainCss/Qna.css';

const MainHeader = () => {
  const location = useLocation(); // 현재 경로 가져오기

  return (
    <div className="mainHeader">
      <nav>
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
          {/* 다른 네비게이션 메뉴를 여기에 추가 */}
        </ul>
      </nav>
    </div>
  );
};

export default MainHeader;
