import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './LoginComponents/Login'
import Signup from './LoginComponents/Signup';
import UserInfo from './LoginComponents/UserInfo';
import MainPage from './Main/MainPage';
import FindUserId from './LoginComponents/FindUserId';
import FindUserPwd from './LoginComponents/FindUserPwd';
import Qna from './MainComponents/Qna';
import Main from './Main/Main';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userinfo/:clientNum" element={<UserInfo />} />
          <Route path='/findUserId' element={<FindUserId />}/>
          <Route path='/findUserPwd' element={<FindUserPwd />}/>
          <Route path='/qna' element={<Qna />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
