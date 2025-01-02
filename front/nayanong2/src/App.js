import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useSetRecoilState  } from 'recoil';
import { clientNumAtom, loginsuccessAtom } from './recoil/UserRecoil';
import Login from './screens/user/Login';
import Signup from './screens/user/Signup';
import UserInfo from './screens/user/UserInfo';
import FindUserId from './screens/user/FindUserId';
import FindUserPwd from './screens/user/FindUserPwd';
import Qna from './screens/board/Qna';
import Header from './screens/Header';
import Board from './screens/board/Board';
import WritePost from './screens/board/WritePost';
import PostDetail from './screens/board/PostDetail';
import UpdatePost from './screens/board/UpdatePost';
import Notice from './screens/board/Notice';
import Farm from './screens/farm/Farm';
import Footer from './screens/Footer';
import ScrollToTop from '../src/screens/screen/ScrollToTop';
import ScrollContainer from '../src/screens/screen/ScrollContainer';

function App() {
    // ScrollContainer의 ref 생성
    const scrollContainerRef = useRef(null);

    /*
     useRecoilState
     상태값을 읽을 수 있고 상태를 읽고 업데이트할 때 사용하며
     상태 값을 읽으므로 리렌더링에 영향이 있다.
     상태를 읽고 바꿀수있다.
    */
     const setLoginSuccess = useSetRecoilState(loginsuccessAtom);
     const setClientNum = useSetRecoilState(clientNumAtom);
 

    /*
      useEffect로 로컬스토리지에서 초기 상태 설정
    */
    useEffect(() => {
        const storedLoginSuccess = localStorage.getItem('loginsuccess') === 'true'; // 로그인 상태 가져오기
        const storedClientNum = localStorage.getItem('clientNum'); // 클라이언트 번호 가져오기

        setLoginSuccess(storedLoginSuccess); // 로그인 상태 설정
        setClientNum(storedClientNum || null); // 클라이언트 번호 설정
    }, [setLoginSuccess, setClientNum]);

    return (
        <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <ScrollToTop containerRef={scrollContainerRef} />
            <InnerApp scrollContainerRef={scrollContainerRef} />
        </Router>
    );
}

// Router 내부에서만 useLocation 사용
function InnerApp({ scrollContainerRef }) {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const showFooterPages = ['/'];

    return (
        <div>
            {/* 로그인 페이지가 아닐 때만 Header 렌더링 */}
            {!isLoginPage && <Header />}
            <ScrollContainer ref={scrollContainerRef}>
                <main>
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
                        <Route path="/" element={<Farm />} />
                    </Routes>
                </main>
                {showFooterPages.includes(location.pathname) && <Footer />}
            </ScrollContainer>
        </div>
    );
}

export default App;
