import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import '../../css/Board.css';
import '../../css/SideBar.css';
import axios from 'axios';

const Board = () => {
    const navigate = useNavigate();
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [posts, setPosts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const [sortBy, setSortBy] = useState('date');

    const toggleSidebar = () => {
        setIsSidebarVisible((prevState) => !prevState);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const getList = async () => {
        try {
            const response = await axios.get('http://localhost:7070/board');
            if (response.status === 200) {
                setPosts(response.data.reverse());
                let sortedPost = response.data;

                switch (sortBy) {
                    case 'date':
                        //(a, b) => { ... } : a - b가 음수면 a->b / 양수면 b->a /0이면 그대로
                        sortedPost = [...sortedPost]; // 배열 복사
                        sortedPost = sortedPost.sort((a, b) => {
                            const dateA = new Date(a.created_at);
                            const dateB = new Date(b.created_at);
                            return dateB - dateA; // 최신순
                        });
                        break;
                    case 'views':
                        sortedPost = sortedPost.sort((a, b) => b.views - a.views); // 조회수 순
                        break;
                    case 'title':
                        sortedPost = sortedPost.sort((a, b) => a.bodTitle.localeCompare(b.bodTitle)); // 제목 ㄱㄴㄷ,123,abc 순
                        break;
                    default:
                        break;
                }
                setPosts(sortedPost);
            }
        } catch (error) {
            console.error('목록을 가져올 수 없습니다.');
            alert('게시글 목록 error');
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
    useEffect(() => {
        getList();
    }, [sortBy]);

    // 페이지 변경
    const handlePageChange = (page) => {
=======
    // 한 페이지에 렌더링되는 게시글의 수 설정
       // 페이지 변경
       const handlePageChange = (page) => {
>>>>>>> test
        setCurrentPage(page);

        //페이지 업데이트시 스크롤을 상단을 위치
        window.scrollTo(0, 0)
    };


    // 검색 함수
    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            alert("검색어를 입력해주세요.");
            return;
        }

        let url = "";
        let params = {};

        switch (searchCategory) {
            case "title":
                url = "http://localhost:7070/board/search/title";
                params = { keyword: searchKeyword };
                break;
            case "content":
                url = "http://localhost:7070/board/search/content";
                params = { keyword: searchKeyword };
                break;
            case "titleOrContent":
                url = "http://localhost:7070/board/search/titleAndContent";
                params = { titleKeyword: searchKeyword, contentKeyword: searchKeyword };
                break;
            case "userNick":
                url = "http://localhost:7070/board/search/userNick";
                params = { keyword: searchKeyword };
                break;
            case "all":
                url = "http://localhost:7070/board/search/all";
                params = { keyword: searchKeyword };
                break;
            default:
                alert("잘못된 검색 범주입니다.");
                return;
        }

        try {
            const response = await axios.get(url, { params });
            if (response.status === 200) {
                setPosts(response.data.reverse());
                setCurrentPage(1);
            } else {
                setPosts([]);
            }
        } catch (error) {
            console.error("검색 중 오류가 발생했습니다.", error);
            alert("검색 실패");
        }
    };

    const totalPages = Math.ceil(posts.length / itemsPerPage);

    const currentPosts = posts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="boardContainer">
            {/* 사이드바 */}
            <div className={`sidebarContainer ${isSidebarVisible ? 'show' : 'hide'}`}>
                <div>
                    <ul>
                        <li><a href="#">공지사항</a></li>
                        <li><a href="#">자유게시판</a></li>
                    </ul>
                </div>
            </div>
            {/* 작성일 및 페이지당 항목 수 선택 섹션 */}
            <div className="boardOptionsContainer">
                <div>
                    <select
                        className="boardSortBySelect"
                        value={sortBy}
                        onChange={handleSortChange}
                    >
                        <option value="date">작성일</option>
                        <option value="views">조회수</option>
                        <option value="title">제목</option>
                    </select>
                    <select
                        className="boardItemsPerPageSelect"
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                        <option value={10}>10개</option>
                        <option value={20}>20개</option>
                        <option value={30}>30개</option>
                    </select>
                </div>
            </div>

            {/* 검색 및 글쓰기 섹션 */}
            <div className="boardInputContainer">
                <div className="boardContainerButton">
                    <button className="sidebarToggleButton" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                    <button className="boardWriteButton" onClick={() => navigate('/write')}>
                        글쓰기
                    </button>
                </div>
                <form
                    className="boardContainerButton2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}
                >
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
                    <button type="submit" className="boardSearchButton">
                        검색
                    </button>
                </form>
            </div>

            {/* 게시글 목록 */}
            <div className="boardListContainer">
                <div className="boardListHeader">
                    <p className="boardListItem boardNumber">번호</p>
                    <p className="boardListItem boardTitle">제목</p>
                    <p className="boardListItem boardAuthor">작성자</p>
                    <p className="boardListItem boardDate">등록일</p>
                    <p className="boardListItem boardViews">조회수</p>
                </div>
                {currentPosts.length > 0 ? (
                    currentPosts.map((post, index) => (
                        <div key={post.bodNum} className="boardList">
                            <p className="boardListItem boardNumber">{index + 1 + (currentPage - 1) * itemsPerPage}</p>
                            <p className="boardListItem boardTitle">
                                <Link to={`/board/${post.bodNum}`}>{post.bodTitle}</Link>
                            </p>
                            <p className="boardListItem boardAuthor">{post.userNick}</p>
                            <p className="boardListItem boardDate">
                                {new Date(post.writeDate).toLocaleDateString("ko-KR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "numeric",
                                }).replace(/\.$/, "")}
                            </p>
                            <p className="boardListItem boardViews">{post.views}</p>
                        </div>
                    ))
                ) : (
                    <p className="boardNoPosts">게시글이 없습니다.</p>
                )}
            </div>

            <div className="boardPagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`boardPageButton ${i + 1 === currentPage ? "boardActivePage" : ""}`}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>

    );
};

export default Board;
