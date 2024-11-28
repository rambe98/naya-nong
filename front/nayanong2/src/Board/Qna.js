import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import '../MainCss/Qna.css';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';

const Qna = () => {
    const navigate = useNavigate('');
    const [nickname, setNickname] = useState(); //닉네임 상태
    const [date, setDate] = useState(''); //작성일자
    const clientNum = localStorage.getItem('clientNum'); //로컬스토리지에 클라이언트넘을 변수에저장

    useEffect(() => {
        const updateDate = () => {
            const currentDate = new Date();
            setDate(currentDate.toLocaleString());
    };
        updateDate(); // 초기 실행
        const interval = setInterval(updateDate, 1000); // 1초마다 실행

        return () => clearInterval(interval); 
        // qna페이지에서 나갈때 1초마다 재실행되면 메모리사용을 하니 방지하기 위해
        // clearInterval 사용 즉, 타이머가 멈춘다
    },[clientNum, navigate])
    // []를 사용하는이유는 페이지가 최초 렌더링 될때 한번만실행해야하고
    // []가 없을경우에는 상태가 변할때마다 업데이트되기때문에 원하는 값이 안나올수있다.(중복된 타이머가 발생)
    useEffect(() => {
        if (!clientNum) {
            const userConfirmed = window.confirm(
                '로그인을 해야 이용 가능한 서비스입니다. \n로그인 페이지로 이동하시겠습니까?'
            );
        if(userConfirmed){
            navigate('/login', { state: { from: '/qna' } });
        }else {
            navigate('/');
        }
        }
    }, []);

    useEffect(() => {
        const fetchNickName = async () => {
            try {
                if (clientNum) { // clientNum이 존재하는 경우에만 실행
                    const response = await axios.get(`http://localhost:7070/users/${clientNum}`);
                    if (response.status === 200) {
                        setNickname(response.data.userNick); // 서버에서 받은 닉네임
                    }
                }
            } catch (error) {
                console.error('닉네임 조회 실패:', error);
            }
        };

        fetchNickName(); // useEffect 실행 시 닉네임 조회
    }, [clientNum]); // clientNum이 변경될 때마다 실행

    return (

        <div className="qnaContainer">
       

            {/* 입력 폼 */}
            <div className="qnaInputContainer">
                <input
                    type="text"
                    placeholder="이름을 입력해주세요"
                    className="qnaInput"
                    value={nickname}
                    readOnly
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
