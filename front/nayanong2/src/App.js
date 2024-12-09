import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { clientNumAtom, loginsuccessAtom, loginsuccessSelector, clientNumSelector } from './recoil/UserRecoil';
import { bodNumAtom } from '../src/recoil/BoardRecoil'
import Login from './screens/user/Login';
import Signup from './screens/user/Signup';
import UserInfo from './screens/user/UserInfo';
import FindUserId from './screens/user/FindUserId';
import FindUserPwd from './screens/user/FindUserPwd';
import Qna from './screens/board/Qna'
import Header from './screens/Header'
import Board from './screens/board/Board'
import WritePost from './screens/board/WritePost'
import PostDetail from './screens/board/PostDetail';
import UpdatePost from './screens/board/UpdatePost';
import Notice from './screens/board/Notice';

function App() {
  
  /*
   useRecoilState
   상태값을 읽을 수 있고 상태를 읽고 업데이트할 때 사용하며
   상태 값을 읽으므로 리렌더링에 영향이 있다. 
   상태를 읽고 바꿀수있다.
  */
  const [loginsuccess, setLoginSuccess] = useRecoilState(loginsuccessAtom);
  const [clientNum, setClientNum] = useRecoilState(clientNumAtom);
  const [bodNum, setBodNum] = useRecoilState(bodNumAtom)

  /*
   useRecoilValue
  Recoil의 상태를 읽기전용으로 가져온다.
  상태를 참조할때 적합함. 
  상태를 읽을수만 있다.
   */
  const initializedLoginSuccess = useRecoilValue(loginsuccessSelector);
  const initializedClientNum = useRecoilValue(clientNumSelector);

  /*
    useSetRecoilState
    상태를 읽지는 않고 바꾸기만 한다.
   */

  useEffect(() =>{
    //초기화된 로그인상태로 로컬스토리지에서 가져온 값을 의미함
    setLoginSuccess(initializedLoginSuccess);
    //초기화된 클라이언트 번호로 로컬스토리지에서 가져온 값을 의미함
    setClientNum(initializedClientNum);
  },[initializedLoginSuccess, initializedClientNum, setLoginSuccess, setClientNum]);


  return(
    <Router>
      <InnerApp />
    </Router>
  )
}

  // Router 내부에서만 useLocation 사용
function InnerApp() {
  const location = useLocation();
const isLoginPage = location.pathname === '/login';
  
  return (
    <div className="App">
      {/* 로그인 페이지가 아닐 때만 Header 렌더링 */}
      {!isLoginPage && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/userinfo/:clientNum" element={<UserInfo />} />
        <Route path="/findUserId" element={<FindUserId />} />
        <Route path="/findUserPwd" element={<FindUserPwd />} />
        <Route path="/qna" element={<Qna />} />
        <Route path="/board" element={<Board />} />
        <Route path="/write" element={<WritePost />} />
        <Route path="/board/:bodNum" element={<PostDetail />} />
        <Route path="/update/:bodNum" element={<UpdatePost />} />
        <Route path="/notice" element={<Notice />} />
      </Routes>
    </div>
  );
}

export default App;
