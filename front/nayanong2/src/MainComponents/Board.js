import React, { useState } from 'react';
import Main from '../Main/Main';
import '../MainCss/Board.css';
import { useNavigate } from 'react-router-dom';
import SideBar from '../Main/SideBar';
import { FaBars } from 'react-icons/fa';

const Board = () => {
    const navigate = useNavigate()

    const [isSidebarVisible, setIsSidebarVisible] = useState(false)

    const toggleSidebar = () => {
        setIsSidebarVisible(prevState => !prevState)
    }


    return (
        <div className="boardContainer">
            <div className={`sidebarContainer ${isSidebarVisible ? 'show' : 'hide'}`}>
                <SideBar />
            </div>
            <div className="boardInputContainer">
                <div className='boardContainerButton'>
                    <button className='sidebarToggleButton' onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                    <button className="boardWriteButton" onClick={() => navigate("/Write")}>글쓰기</button>
                </div>
                <div className='boardContainerButton2'>
                    <input type="text" placeholder="검색어를 입력하세요." className="boardSearchInput" />
                    <button className="boardSearchButton">검색</button>
                </div>
            </div>
            <div className='boardListContainer'>
                <div className='boardListHeader'>
                    <p className='boardListItem number'>번호</p>
                    <p className='boardListItem title'>제목</p>
                    <p className='boardListItem author'>작성자</p>
                    <p className='boardListItem date'>등록일</p>
                    <p className='boardListItem views'>조회수</p>
                </div>
            </div>

        </div>
    );
};

export default Board;
