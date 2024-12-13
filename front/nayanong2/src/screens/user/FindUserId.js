import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/FindUser.css';
import { useNavigate } from 'react-router-dom';
import { smessageAtom } from '../../recoil/UserRecoil';
import { useRecoilState } from 'recoil';

const FindUserId = () => {
  const [message, setMessage] = useRecoilState(smessageAtom);

  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  // 스크롤 없애기
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  // 아이디 찾기 요청
  const findUserId = async () => {
    try {
      const response = await axios.post(`http://localhost:7070/users/find-id/${userEmail}`);
      
      // 서버에서 반환된 메시지를 표시
      setMessage(response.data);
    } catch (error) {
      console.error('Error:', error);
      setMessage('오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="findUserContainer">
      <span className="findUserHeader">아이디 찾기</span>
      <div className="findUserForm">
        <label className="findUserLabel">이메일</label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="이메일 입력"
          className="findUserInput"
        />
        <button onClick={findUserId} className="findUserButton">
          아이디 찾기
        </button>
        {message && <p className="findUserError">{message}</p>}
        <button onClick={() => navigate('/findUserPwd')} className="findUserButton">
          비밀번호 찾기
        </button>
        <button onClick={() => navigate('/login')} className="findUserButton">
          이전
        </button>
      </div>
    </div>
  );
};

export default FindUserId;
