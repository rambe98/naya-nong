import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaSearch } from 'react-icons/fa';
import '../../css/Board.css';
import '../../css/SideBar.css';
import axios from 'axios';
import { useSetRecoilState } from "recoil";
import { searchboardResultsAtom } from "../../recoil/BoardRecoil"
import { API_BASE_URL } from '../../service/api-config';



const Board = () => {
    const navigate = useNavigate();
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [posts, setPosts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchCategory, setSearchCategory] = useState("title");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('date');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const setSearchResults = useSetRecoilState(searchboardResultsAtom);
    const adminUserNick = localStorage.getItem("userNick")

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarVisible((prevState) => !prevState);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const getList = async () => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        try {
            const response = await axios.get(`${API_BASE_URL}/board`, {
                userNick: adminUserNick, //userNick을 쿼리 파라미터로 저장
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`

                    },
                }
            );
            if (response.status === 200) {

                //response.data : 서버에서 받은 게시글 목록
                //filter(post => post.userNick === "rhksflwk")
                // : posts 배열 안에 게시글 중 작성자의 userNick이 "rhksflwk"인 게시글 필터링 
                //filterPost : 필터링된 게시글을 filterPost변수에 저장
                const filterPost = response.data.filter(post => post.userNick === "관리자")
                setPosts(filterPost.reverse());

                let sortedPost = filterPost

                switch (sortBy) {
                    case 'date':
                        sortedPost = [...sortedPost].sort((a, b) => {
                            const dateA = new Date(a.created_at);
                            const dateB = new Date(b.created_at);
                            return dateB - dateA; // 최신순
                        });
                        break;
                    case 'views':
                        sortedPost = sortedPost.sort((a, b) => b.views - a.views); // 조회수 순
                        break;
                    case 'title':
                        sortedPost = sortedPost.sort((a, b) => a.bodTitle.localeCompare(b.bodTitle)); // 제목순
                        break;
                    default:
                        break;
                }
                setPosts(sortedPost);
            }
        } catch (error) {
            console.error('목록을 가져올 수 없습니다.');
            alert('공지사항 목록을 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };


    // 한 페이지에 렌더링되는 게시글의 수 설정
    // 페이지 변경
    const handlePageChange = (page) => {
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
                setCurrentPage(1);
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



    const totalPages = Math.ceil(posts.length / itemsPerPage);

    const currentPosts = posts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    //posts배열에서 userNick값이 관리자인 게시글만 필터링한다.
    //필터 메서드는 조건을 만족하는 요소들만 모아 새로운 배열을 반환한다.
    //필터링된 배열의 길이를 반환한다. 즉, 관리자가 작성한 게시글의 개수를 계산함
    const adminCount = useMemo(() => posts.filter(post => post.userNick === "관리자").length, [posts]);

    useEffect(() => {
        getList();
    }, [sortBy]);
    
    const sidebarClassName = isSidebarVisible ? 'show' : 'hide';

    return (
        <div className="boardContainer">
               {isMobile && (
                <h2 className="boardname">공지사항</h2>
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
                        <h2 className='boardname'>공지사항</h2>
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
                        <button className="boardWriteButton" onClick={() => navigate('/write')}
                            style={{ display: adminUserNick === '관리자' ? 'visible' : 'none' }}>
                            글쓰기
                        </button>
                    </div>
                )}
                {isMobile && (
                    <>
                        <button className="boardsidebarToggleButton" onClick={toggleSidebar}>
                            <FaBars />
                        </button>
                        <button className="boardWriteButton" onClick={() => navigate('/write')}
                            style={{ display: adminUserNick === '관리자' ? 'visible' : 'none' }}>
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
