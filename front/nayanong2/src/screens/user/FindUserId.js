import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../../css/FindUser.css';
import { useNavigate } from 'react-router-dom'
import { messageAtom } from '../../recoil/UserRecoil';
import { useRecoilState } from 'recoil';

const FindUserId = () => {

  const [message, setMessage] = useRecoilState(messageAtom);

  const [userName, setUserName] = useState('')
  const [userPnum, setUserPnum] = useState('')
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigate = useNavigate();

    //스크롤 없애기
    useEffect(() => {
      // body에 클래스 추가
      document.body.classList.add('no-scroll');
  
      // 언마운트 시 클래스 제거
      return () => {
        document.body.classList.remove('no-scroll');
      };
    }, []);


  //인증번호 전송
  const sendVerificationCode = async () => {
    try {
      const response = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPnum }),
      })

      const data = await response.json()
      if (data.success) {
        setMessage('인증번호가 전송되었습니다.')
        setIsCodeSent(true)
      } else {
        setMessage('전화번호를 확인해주세요.')
      }
    } catch (error) {
      setMessage('오류입니다. 다시 시도해 주세요.')
    }
  }

  //아이디 찾기
  const findUserId = async () => {
    try {
      const response = await fetch('/api/find-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, userPnum, verificationCode }),
      })
      const data = await response.json()
      if (data.success) {
        setMessage(`아이디: ${data.id}`)
      } else {
        setMessage("인증번호가 일치하지 않거나 사용자 정보를 찾을 수 없습니다.")
      }
    } catch (error) {
      setMessage('오류입니다. 다시 시도해 주세요.')
    }
  }
  return (
    <div className="findUserContainer">
      <span className="findUserHeader">아이디 찾기</span>
      <div className="findUserForm">
        <label className='findUserLabel'>이름</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="이름"
          className="findUserInput"
        />
        <label className='findUserLabel'>휴대전화</label>
        <input
          type="text"
          value={userPnum}
          onChange={(e) => setUserPnum(e.target.value)}
          placeholder="전화번호"
          className="findUserInput"
        />
        {!isCodeSent ? (
          <button onClick={sendVerificationCode} className="findUserButton">
            인증번호 받기
          </button>
        ) : (
          <div>
            <label>인증번호:</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="인증번호 입력"
              className="findUserInput"
            />
            <button onClick={findUserId} className="findUserButton">
              아이디 찾기
            </button>
          </div>
        )}
        {message && <p className="findUserError">{message}</p>}
        {/* 비밀번호 찾기부분은 추후에 인증번호 받기가 완성되면 활성화되게 변경해야함. */}
        <button onClick={() => navigate('/findUserPwd')} className="findUserButton">
          비밀번호 찾기
        </button>
        <button onClick={() => navigate('/login')} className="findUserButton">
          이전
        </button>

      </div>
    </div>
  );
}
export default FindUserId;