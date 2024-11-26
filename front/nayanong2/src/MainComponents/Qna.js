import React from 'react';
import logo from '../assets/logo.png';
import '../MainCss/Qna.css';
import MainHeader from '../Main/MainHeader';
import { Link } from 'react-router-dom';
import Main from '../Main/Main';

const Qna = () => {
    return (
       
            <div className="qnaContainer">
            <Main />

                {/* 입력 폼 */}
                <div className="qnaInputContainer">
                    <input
                        type="text"
                        placeholder="이름을 입력해주세요"
                        className="qnaInput"
                    />
                    <input
                        type="text"
                        placeholder="제목을 입력해주세요"
                        className="qnaInput"
                    />
                    <textarea
                        placeholder="내용을 입력해주세요"
                        className="qnaInputtext"
                    />
                    <button className="qnaButton">보내기</button>
                </div>
            </div>
 
    );
};

export default Qna;
