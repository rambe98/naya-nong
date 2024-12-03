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

    const toggleSidebar = () => {
        setIsSidebarVisible((prevState) => !prevState);
    };

    const getList = async () => {
        try {
            const response = await axios.get('http://localhost:7070/board');
            if (response.status === 200) {
                setPosts(response.data.reverse());
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

    const handlePageChange = (page) => {
        setCurrentPage(page);
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
                    <select
                        className="boardItemsPerPageSelect"
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                        <option value={10}>10개</option>
                        <option value={20}>20개</option>
                        <option value={30}>30개</option>
                    </select>
                </form>
            </div>

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
