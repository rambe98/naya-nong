import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import '../../css/Board.css'
import '../../css/SideBar.css'
import axios from 'axios';

const Board = () => {
    const navigate = useNavigate();
    
    //사이드바 현재 상태 설정 (기본 false) , setIsSidebarVisible 상태 업데이트 함수
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    //게시글 목록
    const [posts, setPosts] = useState([])
    
    const [showModal , setShowModal] = useState(false)

    // 사이드바 
    const toggleSidebar = () => {
        // (prevState) => !prevState 이전 상태를 !연산자로 반전시킴
        setIsSidebarVisible((prevState) => !prevState);
    };

    //게시글 목록 가져오기
    const getList = async () => {
        try {
            const response = await axios.get('http://localhost:7070/board')
            if (response.status === 200) {
                console.log("board 게시글 : ", response.data);
                const reversePosts = response.data.reverse() //게시글을 최신순으로 정렬하기 위해 reverse()사용
                setPosts(reversePosts) //서버에서 받은 게시글 목록을 상태에 저장
            }
        } catch (error) {
            console.error('목록을 가져올 수 없습니다.')
            alert('게시글 목록 error')
        }
    }
    //컴포넌트가 마운트될 때 게시글 리스트 가져옴
    useEffect(() => {
        getList()
    }, [])

    const handlePasswordClick = async () => {
        try {
          const response = await axios.post(
            "http://localhost:7070/users/verifypassword",
            {
              clientNum: clientNum,
              userPwd: userPwd,
            }
          );
    
          if (response.status === 200) {
            alert("비밀번호가 확인되었습니다.");
            setEdit(true); // 수정 모드 활성화
            setShowModal(false); // 모달 닫기
          } else {
            alert("비밀번호가 일치하지 않습니다.");
          }
        } catch (error) {
          console.error(error);
          alert("비밀번호가 일치하지 않습니다.");
        }
      };


    return (
        <div className="boardContainer">
            {/* 사이드바 컨테이너 , 사이드바 true면 보여줌, false면 숨김*/}
            <div className={`sidebarContainer ${isSidebarVisible ? 'show' : 'hide'}`}>
                <div>
                    <ul>
                        <li><a href="#">공지사항</a></li>
                        <li><a href="#">자유게시판</a></li>
                    </ul>
                </div>
            </div>

            {/* 메인 내용 영역 */}
            <div className="boardInputContainer">
                {/* 사이드바 토글 버튼 */}
                <div className="boardContainerButton">
                    <button className="sidebarToggleButton" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                    {/* 글쓰기 버튼 */}
                    <button className="boardWriteButton" onClick={() => navigate("/write")}>글쓰기</button>
                </div>
                {/* 검색 영역 */}
                <div className="boardContainerButton2">
                    <input type="text" placeholder="검색어를 입력하세요." className="boardSearchInput" />
                    <button className="boardSearchButton">검색</button>
                </div>
            </div>

            {/* 게시판 리스트 bar */}
            <div className="boardListContainer">
                <div className="boardListHeader">
                    <p className="boardListItem number">번호</p>
                    <p className="boardListItem title">제목</p>
                    <p className="boardListItem author">작성자</p>
                    <p className="boardListItem date">등록일</p>
                    <p className="boardListItem views">조회수</p>
                </div>

                {/* 게시글 목록 */}
                {/* 배열에 게시글이 있으면 나오는 내용 */}
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <div key={post.id} className='boardList'>
                            {/* index는 0번부터 시작 , 게시글은 번호는 1번부터 시작해야 해서 +1 */}
                            <p className="boardListItem number">{index + 1}</p>
                            <p className="boardListItem title">
                            <Link to={`/post/${post.bodNum}`}>{post.bodTitle}</Link>
                            </p>
                            <p className="boardListItem author">{post.userNick}</p>
                            <p className="boardListItem date">{post.date}</p>
                            <p className="boardListItem views">{post.views}</p>
                        </div>
                    ))
                ) : (
                    //게시글이 없으면 나오는 내용
                    <p>게시글이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default Board;
