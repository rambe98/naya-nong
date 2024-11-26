import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../MainCss/MainHeader.css';

const MainHeader = () => {
    const navigate = useNavigate();
    
    const [loginsuccess, setLoginSuccess] = useState(false);
    const [clientNum, setClientNum] = useState(null);

    // 컴포넌트가 마운트될 때 로그인 상태 및 clientNum 확인
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('loginsuccess') === 'true';
        const storedClientNum = localStorage.getItem('clientNum');
        setLoginSuccess(isLoggedIn);
        if (storedClientNum) {
            setClientNum(storedClientNum); // 로컬 스토리지에서 clientNum 가져오기
        }
    }, []);

    const handleLogin = () => {
        setLoginSuccess(true);
        localStorage.setItem('loginsuccess', 'true');
        navigate('/');
    };

    const handleLogout = () => {
        setLoginSuccess(false);
        localStorage.removeItem('loginsuccess');
        localStorage.removeItem('clientNum'); // clientNum 제거
        navigate('/');
    };

    const handleLogInfo = () => {
        if (clientNum) {
            // clientNum을 가지고 사용자 정보 페이지로 이동
            navigate(`/userinfo/${clientNum}`);
        } else {
            alert('로그인 정보가 없습니다. 다시 로그인 해주세요.');
        }
    };

    return (
        <header className="mainHeader">
            <img src={logo} alt="Logo" className="mainLogo" />
            <div className="mainlogbtn">
                {!loginsuccess ? (
                    <button className="mainlogin" onClick={() => navigate('/login')}>
                        Signin
                    </button>
                ) : (
                    <>
                        <button className="mainlogout" onClick={handleLogInfo}>
                            UserInfo
                        </button>
                        <button className="mainlogout" onClick={handleLogout}>
                            SignOut
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default MainHeader;
