import React, { useState } from 'react';
import axios from 'axios';
import '../../css/FindUser.css';
import { useNavigate } from 'react-router-dom';
import { smessageAtom } from '../../recoil/UserRecoil';
import { useRecoilState } from 'recoil';

const FindUserPwd = () => {
  const [message, setMessage] = useRecoilState(smessageAtom);

  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  // 비밀번호 찾기 요청
  const findPassword = async () => {
    try {
      const response = await axios.post('http://localhost:7070/users/find-password', null, {
        params: {
          userId,
          userEmail,
        },headers: {
          'Content-Type': 'application/json',
      },
      });

      // 서버에서 반환된 메시지를 표시
      setMessage(response.data);
    } catch (error) {
      console.error('Error:', error);
      // 요청 실패 시 오류 메시지 표시
      setMessage('오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="findUserContainer">
      <span className="findUserHeader">비밀번호 찾기</span>
      <div className="findUserForm">
        <label className="findUserLabel">아이디</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="아이디 입력"
          className="findUserInput"
        />

        <label className="findUserLabel">이메일</label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="이메일 입력"
          className="findUserInput"
        />

        <button onClick={findPassword} className="findUserButton">
          비밀번호 찾기
        </button>

        {message && <p className="findUserError">{message}</p>}

        <button onClick={() => navigate('/login')} className="findUserButton">
          이전
        </button>
      </div>
    </div>
  );
};

export default FindUserPwd;
