import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import '../../css/PostDetail.css';
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { bodNumAtom, searchboardResultsAtom } from "../../recoil/BoardRecoil"; // Recoil 상태 가져오기
import Comments from "./Comments"; // Comments 컴포넌트 추가
import { API_BASE_URL } from '../../service/api-config';

const PostDetail = () => {
    const navigate = useNavigate();
    let { bodNum } = useParams();
    bodNum = parseInt(bodNum, 10); // 덮어쓰기 (정수형으로 변환)
    const setBodNum = useSetRecoilState(bodNumAtom); // Recoil 상태 업데이트 함수
    const localStorageUserNick = localStorage.getItem("userNick");
    const searchResults = useRecoilValue(searchboardResultsAtom);
    const resetSearchResults = useSetRecoilState(searchboardResultsAtom);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const [board, setBoard] = useState({
        bodTitle: "",
        writeDate: "",
        views: 0,
        bodDtail: "",
        likeCount: 0,
        project: { userNick: "알 수 없음" },
    });
    const [likeCount, setLikeCount] = useState(0);

    //좋아요 색상 저장 관리리
    const [icon, setIcon] = useState("outline");
    const [boards, setBoards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    // bodNum Recoil 상태 설정
    useEffect(() => {
        setBodNum(bodNum); // 현재 게시글 번호를 Recoil 상태로 저장
    }, [bodNum, setBodNum]);


    // 현재 배열 가져오기 (공지사항 제외)
    const getCurrentArray = () => {
        if (searchResults.length > 0) {
            const reversedResults = [...searchResults].reverse();
            if (reversedResults.some((post) => post.bodNum === bodNum)) {
                return reversedResults.filter((post) => post.userNick !== "관리자");
            }
        }
        return boards.filter((post) => post.userNick !== "관리자");
    };


    useEffect(() => {
        const getBoardData = async () => {
            const token = localStorage.getItem("ACCESS_TOKEN");
            try {
                const boardsResponse = await axios.get(`${API_BASE_URL}/board`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBoards(boardsResponse.data);

                const postResponse = await axios.get(`${API_BASE_URL}/board/${bodNum}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBoard({
                    ...postResponse.data,
                    project: { userNick: postResponse.data.userNick },
                });
            } catch (error) {
                console.error("게시글 데이터를 불러오는 중 오류 발생:", error);
            } finally {
                setLoading(false);
            }
        };
        getBoardData();
    }, [bodNum]);


    useEffect(() => {
        const currentArray = getCurrentArray();
        // currentIndex 설정
        const index = currentArray.findIndex((post) => post.bodNum === bodNum);
        if (index === -1) {
            setCurrentIndex(null);
        } else {
            setCurrentIndex(index); // 현재 게시글 인덱스 설정
        }
    }, [bodNum, searchResults, boards]);

    const handleBack = () => {
        const currentArray = getCurrentArray();
        if (!currentArray.length || currentIndex === null || currentIndex <= 0) {
            alert("마지막 게시글입니다.");
            return;
        }
        const previousPost = currentArray[currentIndex - 1];
        if (previousPost) {
            navigate(`/board/${previousPost.bodNum}`);
        }
    };

    const handleNext = () => {
        const currentArray = getCurrentArray();
        if (!currentArray.length || currentIndex === null || currentIndex >= currentArray.length - 1) {
            alert("처음 게시글입니다.");
            return;
        }
        const nextPost = currentArray[currentIndex + 1];
        if (nextPost) {
            navigate(`/board/${nextPost.bodNum}`);
        }
    };

    // 페이지 이동 시 reset 호출
    const goToBoard = () => {
        resetSearchResults([]); // 검색 결과 초기화
        navigate("/board"); // 전체 리스트로 이동
    };

    // 좋아요 상태 및 카운트 서버에서 가져오기
    const fetchLikeData = async () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
    
        try {
            const response = await axios.get(`${API_BASE_URL}/heart/${bodNum}/likeCount`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    userNick: localStorageUserNick,
                },
            });
    
            const { likeCount, hikon } = response.data;
            setLikeCount(likeCount);
            setIcon(hikon); // 정확한 필드 이름 사용
        } catch (error) {
            console.error("좋아요 상태 및 개수 가져오기 실패:", error.response?.data || error.message);
        }
    };
    
    






    // 좋아요 토글
    const toggleLike = async () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
    
        try {
            const response = await axios.post(
                `${API_BASE_URL}/heart`,
                {
                    userNick: localStorageUserNick,
                    bodNum: bodNum,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            const { liked, likeCount, hikon } = response.data;
    
            // 서버 응답에 따라 상태 동기화
            setIcon(hikon || (liked ? "filled" : "outline")); // hIcon 또는 liked를 기반으로 설정
            setLikeCount(likeCount);
        } catch (error) {
            console.error("좋아요 처리 실패:", error.response?.data || error.message);
            alert("좋아요 처리 중 오류가 발생했습니다.");
        }
    };
    
    
    


    // 페이지 로드 시 좋아요 개수 초기화
    useEffect(() => {
        fetchLikeData();
    }, [bodNum]); // 게시글 번호가 변경될 때마다 실행

    // 게시글 삭제
    const handleDelete = async () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        // 삭제 권한 체크: 현재 게시글 작성자와 로그인된 사용자 비교 + 관리자인 경우
        if (board.project?.userNick !== localStorageUserNick && localStorageUserNick !== "관리자") {
            alert("삭제 권한이 없습니다.");
            return;
        }
        if (window.confirm("게시글을 삭제하시겠습니까?")) {
            try {
                await axios.delete(`${API_BASE_URL}/board/${bodNum}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("게시글이 삭제되었습니다.");
                navigate("/board");
            } catch (error) {
                console.error("게시글 삭제 실패:", error);
                alert("게시글 삭제에 실패했습니다.");
            }
        }
    };

    // 게시글 배열 나누기
    const currentArray = getCurrentArray();
    const noticeArray = boards.filter((post) => post.userNick === "관리자"); // 공지사항 게시글
    const generalArray = currentArray.filter((post) => post.userNick !== "관리자"); // 일반 게시글

    // 일반 게시글 계산
    const reversedGeneralArray = [...generalArray];
    const totalGeneralPages = reversedGeneralArray.length;
    const currentGeneralPage =
        currentIndex !== null && generalArray.some((post) => post.bodNum === bodNum)
            ? totalGeneralPages - reversedGeneralArray.findIndex((post) => post.bodNum === bodNum)
            : 0;


    if (loading) return <p>로딩 중입니다...</p>;

    return (
        <div className="postDetailContainer">
            <div className="postDetailContent">
                <h2 className="postTitle">{board.bodTitle}</h2>

                {isMobile && (
                    <div className="postInfo">
                        <span>작성자: {board.project?.userNick || "알 수 없음"}</span>
                        <span>작성일: {board.writeDate ? new Date(board.writeDate).toLocaleString() : "알 수 없음"}</span>
                        <span>조회수: {board.views}</span>
                    </div>
                )}

                {!isMobile && (
                    <div className="postInfo">
                        <span>작성자: {board.project?.userNick || "알 수 없음"}</span>
                        <span>작성일: {board.writeDate ? new Date(board.writeDate).toLocaleString() : "알 수 없음"}</span>
                        <span>조회수: {board.views}</span>
                    </div>
                )}
                <div className="postContent">{board.bodDtail}</div>
                <div className="likeSection postInfoicon">
                    <div className="likeSection">
                        <span
                            className="likeIcon"
                            onClick={toggleLike}
                            style={{ cursor: "pointer", fontSize: "1.5rem" }}
                        >
                            {icon === "filled" ? (
                                <FaThumbsUp color="lightblue" /> // 좋아요 눌린 상태
                            ) : (
                                <FaRegThumbsUp color="gray" /> // 기본 상태
                            )}
                        </span>
                        <span style={{ marginLeft: "0.5rem" }}>좋아요: {likeCount}</span>
                    </div>

                    {/* 작성자가 관리자가 아니면 현재게시글 / 전체게시글 나타냄 */}
                    <div>
                        {board.project?.userNick === "관리자" ? (
                            <span></span>
                        ) : (
                            <span>게시글: {currentGeneralPage} / {totalGeneralPages} </span>
                        )}
                    </div>
                </div>


                <div className="postButtonLargeRow">
                    {board.project?.userNick !== "관리자" && (
                        <>
                            <button onClick={handleNext}>이전</button>
                            <button onClick={handleBack}>다음</button>
                        </>
                    )}
                    <button
                        className={board.project?.userNick === localStorageUserNick ? "" : "hidden"}
                        onClick={() => navigate(`/update/${bodNum}`)}
                    >
                        수정
                    </button>
                    <button
                        className={board.project?.userNick === localStorageUserNick || localStorageUserNick === "관리자" ? "" : "hidden"}
                        onClick={handleDelete}
                    >
                        삭제
                    </button>
                    {isMobile && (
                        <button onClick={goToBoard}>목록</button>
                    )}
                    {!isMobile && (
                        <button onClick={goToBoard}>목록으로</button>
                    )}

                </div>
            </div>


            {/* 관리자가 작성한 게시글은 댓글기능x */}
            {board.project?.userNick !== '관리자' ? <Comments /> : null}
        </div>
    );

};

export default PostDetail;
