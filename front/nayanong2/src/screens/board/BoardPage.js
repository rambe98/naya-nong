import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import '../MainCss/Board.css';
import '../MainCss/SideBar.css'; 

const Board = () => {
    const navigate = useNavigate();
    
    //사이드바 현재 상태 설정 (기본 false) , setIsSidebarVisible 상태 업데이트 함수
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    // 사이드바 
    const toggleSidebar = () => {
        // (prevState) => !prevState 이전 상태를 !연산자로 반전시킴
        setIsSidebarVisible((prevState) => !prevState);
    };


    return (
        <div className="boardContainer">
            {/* 사이드바 컨테이너 , 사이드바 true면 보여줌, false면 숨김*/}
            <div className={`sidebarContainer ${isSidebarVisible ? 'show' : 'hide'}`}>
                <div>
                    <ul>
                        <li><a href="#">공지사항</a></li>
                        <li><a href="#">자유게시판</a></li>
                    </ul>
                </div>
            </div>

            {/* 메인 내용 영역 */}
            <div className="boardInputContainer">
                {/* 사이드바 토글 버튼 */}
                <div className="boardContainerButton">
                    <button className="sidebarToggleButton" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                    {/* 글쓰기 버튼 */}
                    <button className="boardWriteButton" onClick={() => navigate("/write")}>글쓰기</button>
                </div>
                {/* 검색 영역 */}
                <div className="boardContainerButton2">
                    <input type="text" placeholder="검색어를 입력하세요." className="boardSearchInput" />
                    <button className="boardSearchButton">검색</button>
                </div>
            </div>

            {/* 게시판 리스트 영역 */}
            <div className="boardListContainer">
                <div className="boardListHeader">
                    <p className="boardListItem number">번호</p>
                    <p className="boardListItem title">제목</p>
                    <p className="boardListItem author">작성자</p>
                    <p className="boardListItem date">등록일</p>
                    <p className="boardListItem views">조회수</p>
                </div>
            </div>
        </div>
    );
};

export default Board;
