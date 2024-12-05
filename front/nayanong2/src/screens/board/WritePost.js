import React, { useEffect, useState } from 'react';
import '../../css/WritePost.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { clientNumAtom } from '../../recoil/UserRecoil';

const WritePost = () => {
    const navigate = useNavigate();

    const clientNum = useRecoilValue(clientNumAtom); // 클라이언트 넘버 가져오기

    const [formData, setFormData] = useState({
        userNick: localStorage.getItem('userNick') || '', // 로컬스토리지에서 닉네임 가져오기
        bodTitle: '', // 제목
        bodDtail: '', // 내용
    });

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
    }, []);

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
        const token = localStorage.getItem("ACCESS_TOKEN"); // 토큰 가져오기
        try {
            const response = await axios.post('http://localhost:7070/board', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                headers: {
                    Authorization: `Bearer ${token}`, // 인증 토큰 추가
                  },
            });

            if (response.status === 200) {
                alert('게시글이 작성되었습니다.');
                setFormData({
                    userNick: localStorage.getItem('userNick') || '', // 초기화
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

    // 이전 버튼
    const handleBack = () => {
        if (formData.bodDtail.trim() !== '') {
            const userConfirmed = window.confirm(
                '작성 중인 내용이 사라집니다. \n정말 이전 페이지로 이동하시겠습니까?'
            );
            if (userConfirmed) {
                // 예 선택시 /board로 이동
                navigate('/board', { state: { from: '/write' } });
            }
        } else {
            // 작성중인 내용이 없으면 /board로 이동
            navigate('/board');
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
                    value={formData.userNick}
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
                <button type="button" className="writeButton" onClick={handleBack}>이전</button>
            </form>
        </div>
    );
};

export default WritePost;
