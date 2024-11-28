import React, { useEffect, useState } from 'react';
import '../MainCss/WritePost.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WritePost = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('') //제목
    const [content, setContent] = useState('') //내용
    const [userNick, setUserNick] = useState(''); //닉네임 상태
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
    }, [clientNum, navigate])
    // []를 사용하는이유는 페이지가 최초 렌더링 될때 한번만실행해야하고
    // []가 없을경우에는 상태가 변할때마다 업데이트되기때문에 원하는 값이 안나올수있다.(중복된 타이머가 발생)

    //닉네임 조회
    useEffect(() => {
        const fetchNickName = async () => {
            try {
                if (clientNum) { // clientNum이 존재하는 경우에만 실행
                    const response = await axios.get(`http://localhost:7070/users/${clientNum}`);
                    if (response.status === 200) {
                        setUserNick(response.data.userNick); // 서버에서 받은 닉네임
                    }
                }
            } catch (error) {
                console.error('닉네임 조회 실패:', error);
            }
        };

        fetchNickName(); // useEffect 실행 시 닉네임 조회
    }, [clientNum]); // clientNum이 변경될 때마다 실행

    //게시글 작성 요청 함수
    const savePost = async (e) => {
        //페이지 새로고침 방지
        e.preventDefault()

        //제목과 내용을 작성해야함
        if (!title) {
            return alert('제목을 입력하세요')
        }
        if (!content) {
            return alert('내용을 입력하세요.')
        }
        const data = {
            userNick : userNick,
            bodTitle : title,
            bodDtail : content,
        }
        try {
            //게시글 작성 API 요청
            const response = await axios.post('http://localhost:7070/board', data)
            if (response.status === 200) {
                alert('게시글이 작성되었습니다.')
                navigate('/board')
            }
        } catch (error) {
            console.error('게시글 작성 에러', error);
            alert('게시글이 작성되지 않았습니다.')
        }
    }

    return (
        <div className="writeContainer">
            <div className="writeInputContainer">
                <input
                    className="writeInput"
                    value={userNick}
                    readOnly
                />
                <input
                    type="text"
                    placeholder="제목을 입력해주세요"
                    className="writeInput"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="내용을 입력해주세요"
                    className="writeInputtext"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button className="writeButton" onClick={savePost}>보내기</button>
            </div>
        </div>
    );
};

export default WritePost
