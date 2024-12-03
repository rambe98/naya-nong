import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import '../../css/Board.css';
import '../../css/SideBar.css';
import axios from 'axios';

const Board = () => {
    const navigate = useNavigate();
    //사이드바 표시여부 관리
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    //게시글 데이터 관리
    const [posts, setPosts] = useState([]);

    //검색어 관리 
    const [searchKeyword, setSearchKeyword] = useState("");

    //검색 범주(전체, 제목, 내용, 제목+내용, 닉네임) 관리
    const [searchCategory, setSearchCategory] = useState("");

    //사이드바의 가시성을 true/false로 전환
    const toggleSidebar = () => {
        setIsSidebarVisible((prevState) => !prevState);
    };

    //서버로부터 게시글 목록을 가져와 posts에 저장 / 최신순 정렬을 위해 reverse()사용
    const getList = async () => {
        try {
            const response = await axios.get('http://localhost:7070/board');
            if (response.status === 200) {
                const reversePosts = response.data.reverse();
                setPosts(reversePosts);
            }
        } catch (error) {
            console.error('목록을 가져올 수 없습니다.');
            alert('게시글 목록 error');
        }
    };

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            alert("검색어를 입력해주세요.");
            return;
        }
    
        let url = "";
        let params = {};
    
        // 검색 범주에 따른 URL 및 파라미터 설정
        switch (searchCategory) {
            case "title": // 제목 검색
                url = "http://localhost:7070/board/search/title";
                params = { keyword: searchKeyword };
                break;
            case "content": // 내용 검색
                url = "http://localhost:7070/board/search/content";
                params = { keyword: searchKeyword };
                break;
            case "titleOrContent": // 제목+내용 검색
                url = "http://localhost:7070/board/search/titleOrContent";
                params = { keyword: searchKeyword }; // 하나의 키워드로 처리
                break;
            case "userNick": // 닉네임 검색
                url = "http://localhost:7070/board/search/userNick";
                params = { keyword: searchKeyword };
                break;
            case "all": // 전체 검색
                url = "http://localhost:7070/board/search/all";
                params = {
                    titleKeyword: searchKeyword,
                    contentKeyword: searchKeyword,
                    userNickKeyword: searchKeyword,
                };
                break;
            default:
                alert("잘못된 검색 범주입니다.");
                return;
        }
    
        try {
            const response = await axios.get(url, { params });
            if (response.status === 200) {
                setPosts(response.data.reverse()); // 최신순 정렬
            } else {
                setPosts([]);
            }
        } catch (error) {
            console.error("검색 중 오류가 발생했습니다.", error);
            alert("검색 실패");
        }
    };
    
    
    
    
    useEffect(() => {
        getList();
    }, []);

    return (
        <div className="boardContainer">
            <div className={`sidebarContainer ${isSidebarVisible ? 'show' : 'hide'}`}>
                <div>
                    <ul>
                        <li><a href="#">공지사항</a></li>
                        <li><a href="#">자유게시판</a></li>
                    </ul>
                </div>
            </div>

            <div className="boardInputContainer">
                <div className="boardContainerButton">
                    <button className="sidebarToggleButton" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                    <button className="boardWriteButton" onClick={() => navigate("/write")}>글쓰기</button>
                </div>
                <div className="boardContainerButton2">
                    <select
                        className="boardSearchCategory"
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                    >
                        <option value="all">전체</option>
                        <option value="title">제목</option>
                        <option value="content">내용</option>
                        <option value="titleOrContent">제목+내용</option>
                        <option value="userNick">닉네임</option>
                        
                    </select>
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요."
                        className="boardSearchInput"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <button className="boardSearchButton" onClick={handleSearch}>검색</button>
                </div>
            </div>

            <div className="boardListContainer">
                <div className="boardListHeader">
                    <p className="boardListItem number">번호</p>
                    <p className="boardListItem title">제목</p>
                    <p className="boardListItem author">작성자</p>
                    <p className="boardListItem date">등록일</p>
                    <p className="boardListItem views">조회수</p>
                </div>
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <div key={post.id} className="boardList">
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
                    <p>게시글이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default Board;
