import React, { useState, useEffect } from 'react'
import logo from '../assets/logo.jpg'
import '../LoginCss/UserInfo.css'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const UserInfo = () => {
  const { clientNum } = useParams(); // URL에서 clientNum을 가져옴\

  const [edit, setEdit] = useState(false);
  const [backupUserInfo, setBackupUserInfo] = useState(null); // 백업 상태

  const [userInfo, setUserInfo] = useState([{
    userId: "",
    userName: "",
    userPwd: "",
    userNick: "",
    userEmail: "",
    userPnum: "",
    userTelecom: "",
  }])

  //사용자마다 고유index번호가 있는데 사용자가변경될때마다 렌더링된다.
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:7070/users/${clientNum}`);
        setUserInfo(response.data);
      } catch (error) {
        console.log("회원정보 로드 실패:", error);
      }
    }
    fetchUserInfo();
  }, [clientNum])

  //수정이 완료되면 서버에 put요청
  const handleSaveClick = async () => {
    try {
      await axios.put(`http://localhost:7070/users/${clientNum}`, userInfo, {
    });
    console.log(clientNum);
    
      console.log('저장된 값 :', userInfo);
      alert('수정이 완료되었습니다.');
      setEdit(false); // userInfo를 업데이트하는 put요청을 보내면 수정버튼 비활성화를 시킨다.
    } catch (error) {
      console.log("저장 실패:", error);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    //이전 상태를 참조하기위해 prev를 사용
    setUserInfo((prev) => {
      // 이전 상태의 0번째배열을 가져오고
      //input창의 name이 예를들어 userPwd면 value는 사용자가입력한값이되고
      //그걸 updateUser에 저장한다.
      const updatedUser = { ...prev[0], [name]: value };
      //return 으로 배열형태의 [updatedUser]로 저장한다.
      return [updatedUser];
    })
  }

  const handleEditClick = () => {
    //기본값은 false인데 true로 변경이되면 수정창이열린다.
    setEdit(true);
    //수정되기 전 상태를 백업하여 취소버튼을 눌렀을 때 원래상태로 복원이가능함.
    setBackupUserInfo([...userInfo]);
  }

  const handleCancelClick = () => {
    // 취소 버튼을 클릭하면 backupUserInfo가 null이 아닌 경우,
    // 백업된 backupUserInfo의 값을 userInfo 상태로 복원한다.
    // 수정버튼을 누름과동시에 backupUserInfo에는 정보가 저장된다.
    // 정보가 있으면 backupUserInfo를 userInfo로 복원하는 작업이다.
    if (backupUserInfo) {
      setUserInfo([...backupUserInfo]); // 백업된 상태 복원
    }
    // 수정모드를 비활성화한다.
    setEdit(false);
  }

  return (
    <div className='userInfoContainer'>
      <img src={logo} alt='logo' className='userInfoLogo' />
      <h2 className='userInfoHeader'>회원정보수정</h2>

      {/* {상태변수 ? (<></>) : (<></>) 삼항연산자를 사용함}*/}
      <form className="userInfoForm">
        {edit ? (
          <>
            <div className="formGroup">
              <label className="formLabel">아이디:</label>
              <span className="formText">{userInfo[0].userId}</span>
            </div>
            <div className="formGroup">
              <label className="formLabel">이름:</label>
              <span className="formText">{userInfo[0].userName}</span>
            </div>
            <div className="formGroup">
              <label className="formLabel">비밀번호:</label>
              <input
                className="formInput"
                type="password"
                name="userPwd"
                value={userInfo[0].userPwd}
                onChange={handleInputChange}
              />
            </div>
            <div className="formGroup">
              <label className="formLabel">닉네임:</label>
              <input
                className="formInput"
                type="text"
                name="userNick"
                value={userInfo[0].userNick}
                onChange={handleInputChange}
              />
            </div>
            <div className="formGroup">
              <label className="formLabel">이메일:</label>
              <input
                className="formInput"
                type="text"
                name="userEmail"
                value={userInfo[0].userEmail}
                onChange={handleInputChange}
              />
            </div>
            <div className="formGroup">
              <label className="formLabel">핸드폰번호:</label>
              <span className="formText">{userInfo[0].userPnum}</span>
            </div>
            <button className="formButton primaryButton" type="button" onClick={handleSaveClick}>
              저장
            </button>
            <button className="formButton secondaryButton" type="button" onClick={handleCancelClick}>
              취소
            </button>
          </>
        ) : (
          <>
            <div className="formGroup">
              <label className="formLabel">아이디:</label>
              <span className="formText">{userInfo[0].userId}</span>
            </div>
            <div className="formGroup">
              <label className="formLabel">이름:</label>
              <span className="formText">{userInfo[0].userName}</span>
            </div>
            <div className="formGroup">
              <label className="formLabel">비밀번호:</label>
              <span className="formText">{userInfo[0].userPwd}</span>
            </div>
            <div className="formGroup">
              <label className="formLabel">닉네임:</label>
              <span className="formText">{userInfo[0].userNick}</span>
            </div>
            <div className="formGroup">
              <label className="formLabel">이메일:</label>
              <span className="formText">{userInfo[0].userEmail}</span>
            </div>
            <div className="formGroup">
              <label className="formLabel">핸드폰번호:</label>
              <span className="formText">{userInfo[0].userPnum}</span>
            </div>
            <button className="formButton primaryButton" type="button" onClick={handleEditClick}>
              수정
            </button>
            <button className="formButton secondaryButton" type="button" onClick={() => { }}>
              돌아가기
            </button>
          </>
        )}
      </form>

    </div>
  )
}

export default UserInfo
