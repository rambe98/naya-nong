import React, { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import '../LoginCss/UserInfo.css'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const UserInfo = () => {
  const { clientNum } = useParams(); // URL에서 clientNum을 가져옵니다.
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [backupUserInfo, setBackupUserInfo] = useState(null); // 백업 상태

  const [userInfo, setUserInfo] = useState({
    userId: "",
    userName: "",
    userPwd: "",
    userNick: "",
    userEmail: "",
    userPnum: "",
    userTelecom: "",
  })

  // 사용자마다 고유 index 번호가 있는데 사용자가 변경될 때마다 렌더링된다.
  useEffect(() => {
    const fetchUserInfo = async () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleEditClick = () => {
    setEdit(true);
    setBackupUserInfo({ ...userInfo });
  }

  const handleCancelClick = () => {
    if (backupUserInfo) {
      setUserInfo({ ...backupUserInfo });
    }
    setEdit(false);
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
          type="password"
          name="userPwd"
          value={userInfo.userPwd}
          onChange={handleInputChange}
        />
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
        <span className="userInfoFormText">{userInfo.userPwd}</span>
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

    </div>
  );
};

export default UserInfo;
