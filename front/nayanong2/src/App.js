import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './LoginComponents/Login'
import Signup from './LoginComponents/Signup';
import UserInfo from './LoginComponents/UserInfo';
import MainPage from './Main/MainPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userinfo/:clientNum" element={<UserInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
