import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/FindUser.css';
import { useNavigate } from 'react-router-dom';
import { smessageAtom } from '../../recoil/UserRecoil';
import { useRecoilState } from 'recoil';
import { API_BASE_URL } from '../../service/api-config';

const FindUserId = () => {
  //서버 통신시 메시지 상태를 담당하는 Recoil 상태
  const [message, setMessage] = useRecoilState(smessageAtom);
  //사용자에게 입력받는 이메일 상태관리
  const [userEmail, setUserEmail] = useState('');
  //로딩 상태관리
  const [isLoading, setIsLoading] = useState(false);
  //네비게이트
  const navigate = useNavigate();

  // 컴포넌트 언마운트 시 메시지 초기화
  useEffect(() => {
    return () => {
      setMessage('');
    };
  }, []);

  // 아이디 찾기 요청
  const findUserId = async () => {
    setIsLoading(true); // 로딩 상태 시작
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/find-id`,
        { userEmail }
      );
      setMessage(response.data); // 서버에서 반환된 메시지
    } catch (error) {
      console.error('Error:', error);
      setMessage('오류가 발생했습니다. 다시 시도해 주세요.'); // 오류 발생 메시지 업데이트
    } finally {
      setIsLoading(false); // 로딩 상태 종료 
    }
  };

  //findUserId함수를 엔터키로 호출출
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      findUserId();
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
          disabled={isLoading} // 요청 중일 때 입력 비활성화
          onKeyDown={handleKeyDown} 
        />
        <button onClick={findUserId} className="findUserButton" disabled={isLoading}>
          {isLoading ? '전송 중...' : '아이디 찾기'}
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
