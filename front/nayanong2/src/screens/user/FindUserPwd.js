import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/FindUser.css';
import { useNavigate } from 'react-router-dom';
import { smessageAtom } from '../../recoil/UserRecoil';
import { useRecoilState } from 'recoil';

const FindUserPwd = () => {
  const [message, setMessage] = useRecoilState(smessageAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

    useEffect(() => {
      document.body.classList.add('no-scroll');
      return () => {
        document.body.classList.remove('no-scroll');
        // 컴포넌트 언마운트 시 메시지 초기화
        setMessage('');
      };
    }, []);

  // 비밀번호 찾기 요청
  const findPassword = async () => {
    setIsLoading(true); // 로딩 상태 시작
    try {
      const response = await axios.post('http://localhost:7070/users/find-password', {
        userId: userId,
        userEmail: userEmail,
      });

      setMessage(response.data); // 서버에서 반환된 메시지
      
    } catch (error) {
      console.error('Error:', error);
      setMessage('오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      findPassword(); 
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
          disabled={isLoading} // 요청 중 입력 비활성화
        />

        <label className="findUserLabel">이메일</label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="이메일 입력"
          className="findUserInput"
          disabled={isLoading} // 요청 중 입력 비활성화
          onKeyDown={handleKeyDown} 
        />

        <button onClick={findPassword} className="findUserButton" disabled={isLoading}>
          {isLoading ? '전송 중...' : '비밀번호 찾기'}
        </button>

        {message && <p className="findUserError">{message}</p>}

        <button onClick={() => navigate('/login')} className="findUserButton" >
          이전
        </button>
      </div>
    </div>
  );
};

export default FindUserPwd;
