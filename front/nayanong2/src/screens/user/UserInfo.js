import React, { useState, useEffect } from 'react'
import logo from '../../assets/logo.png'
import '../../css/UserInfo.css'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const UserInfo = () => {
  const { clientNum } = useParams(); // URL에서 clientNum을 가져옵니다.
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [backupUserInfo, setBackupUserInfo] = useState(null); // 백업 상태
  const [showModal, setShowModal] = useState(false); //모달 표시상태
  const [password, setPassword] = useState(''); //입력된비밀번호
  const [showPassword, setShowPassword] = useState(false);

  const [userInfo, setUserInfo] = useState({
    userId: "",
    userName: "",
    userPwd: "",
    userNick: "",
    userEmail: "",
    userPnum: "",
    phoneCom: "",
  })

  // 사용자마다 고유 index 번호가 있는데 사용자가 변경될 때마다 렌더링된다.
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!clientNum) return;

      try {
        // 서버에서 사용자 정보 요청
        const response = await axios.get(`http://localhost:7070/users/${clientNum}`);

        if (response.data.clientNum) {
          setUserInfo(response.data);
        } else {
          throw new Error('회원 정보를 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('회원정보 로드 실패:', error);
      }
    };

    if (clientNum) {
      fetchUserInfo();
    }
  }, [clientNum]);

  // 수정버튼을 눌렀을 때  비밀번호 모달창에 비밀번호를 서버에 전송해서 db와 비교하는 post요청
  const handlePasswordClick = async () => {
    try {
      const response = await axios.post('http://localhost:7070/users/verifypassword', {
        clientNum: clientNum,
        userPwd: password,
      },
    );
      if (response.status === 200) {
        alert('비밀번호가 확인 되었습니다.');
        setEdit(true); // 수정 모드 진입하기
        setShowModal(false); //모달 닫기
      } else {
        
      }
    } catch (error) {
      console.error(error);
      alert('비밀번호가 일치하지 않습니다.')

    }
  }

  // 수정이 완료되면 서버에 PUT 요청
  const handleSaveClick = async () => {
    try {
      const response = await axios.put(`http://localhost:7070/users/${clientNum}`, userInfo);
      alert('수정이 완료되었습니다.');
      setEdit(false); // userInfo를 업데이트하는 PUT 요청을 보내면 수정 버튼 비활성화
    } catch (error) {
      console.log("저장 실패:", error);
      alert('저장 중 문제가 발생했습니다.');
    }
  }

  // 수정상태의 입력값 변경
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // 수정버튼
  const handleEditClick = () => {
    console.log('모달 열림 이전 상태:', showModal)
    setShowModal(true);
    console.log('모달 열림 이후 상태:', showModal);
    setBackupUserInfo({ ...userInfo });
  }

  // 취소버튼
  const handleCancelClick = () => {
    if (backupUserInfo) {
      setUserInfo({ ...backupUserInfo });
    }
    setEdit(false);
  }

  //비밀번호 보이기&숨기기
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  }


  return (
    <div className='userInfoContainer'>
      <img src={logo} alt='logo' className='userInfoLogo' />
      <h2 className='userInfoHeader'>회원정보수정</h2>
  
      <form className="userInfoForm">
        {edit ? (
          <>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">아이디:</label>
              <span className="userInfoFormText">{userInfo.userId}</span>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">이름:</label>
              <span className="userInfoFormText">{userInfo.userName}</span>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">비밀번호:</label>
              <input
                className="userInfoFormInput"
                type={showPassword ? 'text' : 'password'}
                name="userPwd"
                value={userInfo.userPwd}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#D9CBB6',
                  border: 'none',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? '숨기기' : '보이기'}
              </button>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">닉네임:</label>
              <input
                className="userInfoFormInput"
                type="text"
                name="userNick"
                value={userInfo.userNick}
                onChange={handleInputChange}
              />
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">이메일:</label>
              <input
                className="userInfoFormInput"
                type="text"
                name="userEmail"
                value={userInfo.userEmail}
                onChange={handleInputChange}
              />
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">핸드폰번호:</label>
              <span className="userInfoFormText">{userInfo.userPnum}</span>
            </div>
            <button
              className="userInfoFormButton"
              type="button"
              onClick={handleSaveClick}
            >
              저장
            </button>
            <button
              className="userInfoFormButton userInfoFormCancelButton"
              type="button"
              onClick={handleCancelClick}
            >
              취소
            </button>
          </>
        ) : (
          <>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">아이디:</label>
              <span className="userInfoFormText">{userInfo.userId}</span>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">이름:</label>
              <span className="userInfoFormText">{userInfo.userName}</span>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">비밀번호:</label>
              <span className="userInfoFormText">{"*".repeat(userInfo.userPwd.length)}</span>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">닉네임:</label>
              <span className="userInfoFormText">{userInfo.userNick}</span>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">이메일:</label>
              <span className="userInfoFormText">{userInfo.userEmail}</span>
            </div>
            <div className="userInfoFormGroup">
              <label className="userInfoFormLabel">핸드폰번호:</label>
              <span className="userInfoFormText">{userInfo.userPnum}</span>
            </div>
            <button
              className="userInfoFormButton"
              type="button"
              onClick={handleEditClick}
            >
              수정
            </button>
            <button
              className="userInfoFormButton userInfoFormCancelButton"
              type="button"
              onClick={() => navigate('/')}
            >
              돌아가기
            </button>
          </>
        )}
      </form>
  
      {/* 모달 UI 추가 */}
      {showModal && (
        <div className="modalOverlay">
          <form
            className="modalContent"
            onSubmit={(e) => {
              e.preventDefault(); // 기본 제출 동작 방지
              handlePasswordClick(); // 비밀번호 확인 처리
            }}
          >
            <h3>비밀번호 확인</h3>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="modalInput"
            />
            <div className="modalButtons">
              <button type="submit" className="modalConfirmButton">
                확인
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="modalCancelButton"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
  
};

export default UserInfo;
