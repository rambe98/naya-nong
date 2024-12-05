import React, { useEffect, useState } from 'react';
import '../../css/WritePost.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { clientNumAtom, userNickAtom } from '../../recoil/UserRecoil';

const WritePost = () => {
    const navigate = useNavigate();

    const [userNick, setUserNick] = useRecoilState(userNickAtom); // 닉네임 상태
    const clientNum = useRecoilValue(clientNumAtom); // 로컬스토리지에 클라이언트 넘을 변수에 저장

    const [formData, setFormData] = useState({
        userNick: userNick,
        bodTitle: '', // 제목
        bodDtail: '', // 내용
    });

    useEffect(() => {
        // body에 클래스 추가
        document.body.classList.add('no-scroll');
    
        // 언마운트 시 클래스 제거
        return () => {
          document.body.classList.remove('no-scroll');
        };
      }, []);

    // 날짜 상태 (작성일자)
    const [date, setDate] = useState('');

    useEffect(() => {
        const updateDate = () => {
            const currentDate = new Date();
            setDate(currentDate.toLocaleString());
        };
        updateDate(); // 초기 실행
        const interval = setInterval(updateDate, 1000); // 1초마다 실행

        return () => clearInterval(interval);
    }, [clientNum, navigate]);

    // 로그인 선행
    useEffect(() => {
        if (!clientNum) {
            const userConfirmed = window.confirm(
                '로그인을 해야 이용 가능한 서비스입니다. \n로그인 페이지로 이동하시겠습니까?'
            );
            if (userConfirmed) {
                navigate('/login', { state: { from: '/write' } });
            } else {
                navigate('/');
            }
        }
    }, [clientNum, navigate]);

    // 닉네임 조회
    useEffect(() => {
        const getUserNick = async () => {
            try {
                if (clientNum) {
                    const response = await axios.get(`http://localhost:7070/users/${clientNum}`);
                    if (response.status === 200) {
                        setUserNick(response.data.userNick);
                    }
                }
            } catch (error) {
                console.error('닉네임 조회 실패:', error);
            }
        };
        getUserNick(); // useEffect 실행 시 닉네임 조회
    }, [clientNum, setUserNick]);

    // 폼 데이터 변경
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 게시글 작성 요청
    const handleSubmit = async (e) => {
        e.preventDefault();

         // 제목과 내용이 비어 있으면 알림
         if (!formData.bodTitle || formData.bodTitle.trim() === '') {
            return alert('제목을 입력하세요');
        }
        if (!formData.bodDtail || formData.bodDtail.trim() === '') {
            return alert('내용을 입력하세요');
        }


        try {
            const response = await axios.post('http://localhost:7070/board', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                alert('게시글이 작성되었습니다.');
                setFormData({
                    userNick: userNick,
                    bodTitle: '',
                    bodDtail: '',
                });
                navigate('/board');
            }
        } catch (error) {
            console.error('게시글 작성 실패:', error);
            alert('게시글 작성이 실패했습니다.');
        }
    };

    return (
        <div className="writeContainer">
            <span className="writeHeader">글쓰기</span>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="writeInputContainer">
                {/* 닉네임 */}
                <input
                    type="text"
                    name="userNick"
                    placeholder="닉네임"
                    className="writeInput"
                    value={userNick}
                    readOnly // 읽기 전용
                />

                {/* 제목 */}
                <input
                    type="text"
                    name="bodTitle"
                    placeholder="제목을 입력해주세요"
                    className="writeInput"
                    value={formData.bodTitle}
                    onChange={handleChange}
                    required
                />

                {/* 내용 */}
                <textarea
                    name="bodDtail"
                    placeholder="내용을 입력해주세요"
                    className="writeInputtext"
                    value={formData.bodDtail}
                    onChange={handleChange}
                    required
                />

                {/* 제출 버튼 */}
                <button type="submit" className="writeButton">작성</button>
                <button type="button" className="writeButton" onClick={() => navigate('/board')}>이전</button>
            </form>
        </div>
    );
};

export default WritePost;
