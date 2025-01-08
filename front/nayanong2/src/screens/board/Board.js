import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaSearch } from 'react-icons/fa';
import '../../css/Board.css';
import '../../css/SideBar.css';
import axios from 'axios';
import { useSetRecoilState, useRecoilValue } from "recoil";
import { searchboardResultsAtom } from "../../recoil/BoardRecoil"
import { scrollAtom } from '../../recoil/ScrollRecoil'
import { API_BASE_URL } from '../../service/api-config';



const Board = () => {
    const navigate = useNavigate();  // 페이지 이동을 위한 useNavigate 훅
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);  // 사이드바 보이기 여부 상태
    const [posts, setPosts] = useState([]);  // 게시글 목록 상태
    const [searchKeyword, setSearchKeyword] = useState("");  // 검색어 상태
    const [searchCategory, setSearchCategory] = useState("title");  // 검색 카테고리 상태 (기본값: 제목)
    const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 상태
    const [itemsPerPage, setItemsPerPage] = useState(10);  // 페이지당 게시글 수
    const [loading, setLoading] = useState(true);  // 로딩 상태
    const [sortBy, setSortBy] = useState('date');  // 정렬 기준 상태 (기본값: 날짜순)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);  // 모바일 여부 확인 (화면 크기 기준)
    const setSearchResults = useSetRecoilState(searchboardResultsAtom);  // 검색 결과를 Recoil 상태에 설정하는 함수
    const scrollPosition = useRecoilValue(scrollAtom);  // 스크롤 위치 상태
    const isVisible = scrollPosition < 80;  // 헤더의 보임 여부 판단 (스크롤 위치 기준)

    // 화면 크기 변화 시 모바일 여부 상태 변경
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 사이드바 토글 함수
    const toggleSidebar = () => {
        setIsSidebarVisible((prevState) => !prevState); //현재 상태를 반전
    };


    // 정렬 방식 변경 함수
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    // 게시글 목록 가져오는 함수
    const getList = async () => {
        // 로컬스토리지에서 액세스 토큰 가져오기
        const token = localStorage.getItem('ACCESS_TOKEN')
        try {
            const response = await axios.get(`${API_BASE_URL}/board`,
                {
                    headers: {
                        // Authorization 헤더에 토큰 추가
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                // 원본 데이터를 sortedPost로 복사
                let sortedPost = response.data;

                // 작성자의 게시글과 다른 유저의 게시글 분리
                // 공지사항 3개로 제한
                const adminPost = sortedPost.filter(post => post.userNick === "관리자").reverse().slice(0, 3);
                const otherPost = sortedPost.filter(post => post.userNick !== "관리자");

                // 다른 유저의 게시글을 정렬
                let sortedOtherPost = [...otherPost];

                switch (sortBy) {
                    case 'date': // 최신순
                        sortedOtherPost = sortedOtherPost.sort((a, b) => {
                            const dateA = new Date(a.created_at);
                            const dateB = new Date(b.created_at);
                            return dateB - dateA;
                        }).reverse(); 
                        break;
                    case 'views': //조회수순
                        sortedOtherPost = sortedOtherPost.sort((a, b) => b.views - a.views); // 조회수 순
                        break;
                    case 'title': //제목순
                        sortedOtherPost = sortedOtherPost.sort((a, b) => a.bodTitle.localeCompare(b.bodTitle)); // 제목순
                        break;
                    default:
                        break;
                }

                // 관리자 게시글을 최상단에 두고 나머지 게시글들을 정렬 후 합침
                sortedPost = [...adminPost, ...sortedOtherPost];

                // 게시글 업데이트
                setPosts(sortedPost);
            }
        } catch (error) {
            console.error('목록을 가져올 수 없습니다.');
            alert('게시글 목록을 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };


    // 페이지 변경

    const handlePageChange = (page) => {
        //현재 페이지를 새 페이지로 설정
        setCurrentPage(page);
        console.log(currentPage);
        
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
        // 검색 카테고리에 따라 API URL과 파라미터 설정
        switch (searchCategory) {
            case "title":
                url = `${API_BASE_URL}/board/search/title`;
                params = { keyword: searchKeyword };
                break;
            case "content":
                url = `${API_BASE_URL}/board/search/content`;
                params = { keyword: searchKeyword };
                break;
            case "titleOrContent":
                url = `${API_BASE_URL}/board/search/titleAndContent`;
                params = { titleKeyword: searchKeyword, contentKeyword: searchKeyword };
                break;
            case "userNick":
                url = `${API_BASE_URL}/board/search/userNick`;
                params = { keyword: searchKeyword };
                break;
            case "all":
                url = `${API_BASE_URL}/board/search/all`;
                params = { keyword: searchKeyword };
                break;
            default:
                alert("잘못된 검색 범주입니다.");
                return;
        }
        const token = localStorage.getItem("ACCESS_TOKEN");
        try {
            const response = await axios.get(url, {
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                // 관리자 게시글과 다른 사용지들의 게시글 구분
                const adminPosts = response.data.filter((post) => post.userNick === "관리자").reverse();
                const otherPosts = response.data.filter((post) => post.userNick !== "관리자");

                let sortedOtherPosts = [...otherPosts];
                switch (sortBy) {
                    case "date":
                        sortedOtherPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                        break;
                    case "views":
                        sortedOtherPosts.sort((a, b) => b.views - a.views);
                        break;
                    case "title":
                        sortedOtherPosts.sort((a, b) => a.bodTitle.localeCompare(b.bodTitle));
                        break;
                    default:
                        break;
                }
                const finalPosts = [...adminPosts, ...sortedOtherPosts];
                if (finalPosts.length === 0) {
                    alert("검색 결과가 없습니다.");
                }
                setSearchResults(finalPosts); // 검색 결과를 Recoil 상태로 저장
                setPosts(finalPosts); // 검색된 게시글 리스트 업데이트
                setCurrentPage(1); //검색 후 첫 페이지로 이동
            } else {
                console.error("검색 실패", response.status);
                setSearchResults([]); // 검색 결과 초기화
                setPosts([]);
            }
        } catch (error) {
            console.error("검색 중 오류가 발생했습니다.", error);
            alert("검색 실패");
            setSearchResults([]); // 검색 결과 초기화
            setPosts([]);
        }
    };



    //한 페이지에 렌더링되는 게시글의 수 설정
    const totalPages = Math.ceil(posts.length / itemsPerPage);

    const currentPosts = posts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    //posts배열에서 userNick값이 관리자인 게시글만 필터링한다.
    //필터 메서드는 조건을 만족하는 요소들만 모아 새로운 배열을 반환한다.
    //필터링된 배열의 길이를 반환한다. 즉, 관리자가 작성한 게시글의 개수를 계산함
    const adminCount = useMemo(() => posts.filter(post => post.userNick === "관리자").length, [posts]);

    // 정렬 기준이 변경될 때마다 게시글 목록을 갱신하는 useEffect
    useEffect(() => {
        getList();
    }, [sortBy]);

    // 사이드바의 보임/숨김 상태
    const sidebarClassName = isSidebarVisible ? 'show' : 'hide';

    return (
        <div className="boardContainer">
            {isMobile && (
                <h2 className="boardname">자유게시판</h2>
            )}
            {/* 사이드바 */}
            <div className='boardSidebarList'>
                <div className={`boardSidebarContainer ${sidebarClassName}`}>
                    <button
                        className="boardCloseSidebarButton"
                        onClick={toggleSidebar}
                    >
                        CLOSE
                    </button>
                </div>
                <div className={`boardSidebarContainer2 ${sidebarClassName}`}>
                    <ul>
                        <li>
                            <Link to="/board" className="boardSidebarLink">
                                자유게시판
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={`boardSidebarContainer3 ${sidebarClassName}`}>
                    <ul>
                        <li>
                            <Link to="/notice" className="boardSidebarLink">
                                공지사항
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            {/* 작성일 및 페이지당 항목 수 선택 */}
            {!isMobile && (
                <div className="boardOptionsContainer">
                    <div>
                        <h2 className="boardname">자유게시판</h2>
                    </div>
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
            )}

            {/* 검색 및 글쓰기 */}
            <div className="boardInputContainer">

                {/* 버튼 및 정렬 옵션 */}
                {!isMobile && (
                    <div className="boardActionContainer">

                        <button className="sidebarToggleButton" onClick={toggleSidebar}>
                            <FaBars />
                        </button>
                        <button className="boardWriteButton" onClick={() => navigate('/write')}>
                            글쓰기
                        </button>

                    </div>
                )}
                {isMobile && (
                    <>
                        <button className="boardsidebarToggleButton" onClick={toggleSidebar}>
                            <FaBars />
                        </button>
                        <button className="boardWriteButton" onClick={() => navigate('/write')}>
                            글쓰기
                        </button>
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
                    </>
                )}
                {/* 웹화면 */}
                {!isMobile && (
                    <div className="boardSearchForm">
                        <form
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
                                <FaSearch />
                            </button>
                        </form>
                    </div>
                )}
            </div>
            {/* 모바일 화면 */}
            {isMobile && (
                <div className="boardInputContainer">
                    <form
                        className="boardSearchForm"
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
                            <FaSearch />
                        </button>
                    </form>
                </div>
            )}


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
                        <div key={post.bodNum} className={`boardList ${post.userNick === '관리자' ? 'adminBoardList' : ''}`}>
                            <p className={`boardListItem boardNumber ${post.userNick === '관리자' ? 'highlightAdminPost' : ''}`}>
                                {post.userNick === "관리자"
                                    ? '* 공지 *'
                                    : index + 1 + (currentPage - 1) * itemsPerPage - adminCount
                                }
                            </p>
                            <p className="boardListItem boardTitle">
                                <Link to={`/board/${post.bodNum}`}>{post.bodTitle}</Link>
                            </p>
                            <p className="boardListItem boardAuthor">{post.userNick}</p>
                            {isMobile && (
                                <p className="boardListItem boardDate">
                                    {new Date(post.writeDate).toLocaleDateString("ko-KR", {
                                        month: "2-digit",
                                        day: "2-digit",
                                    }).replace(/\.$/, "")}
                                </p>
                            )}
                            {!isMobile && (
                                <p className="boardListItem boardDate">
                                    {new Date(post.writeDate).toLocaleDateString("ko-KR", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "numeric",
                                    }).replace(/\.$/, "")}
                                </p>
                            )}
                            <p className="boardListItem boardViews">{post.views}</p>
                        </div>
                    ))
                ) : (
                    <p className="boardNoPosts">게시글이 없습니다.</p>
                )}
            </div>

            {/* 페이지네이션 */}
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
