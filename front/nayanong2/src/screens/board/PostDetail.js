import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import '../../css/PostDetail.css';
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { bodNumAtom, searchResultsAtom } from "../../recoil/BoardRecoil"; // Recoil 상태 가져오기
import Comments from "./Comments"; // Comments 컴포넌트 추가

const PostDetail = () => {
    const navigate = useNavigate();
    let { bodNum } = useParams();
    bodNum = parseInt(bodNum, 10); // 덮어쓰기 (정수형으로 변환)
    const setBodNum = useSetRecoilState(bodNumAtom); // Recoil 상태 업데이트 함수
    const localStorageUserNick = localStorage.getItem("userNick");
    const searchResults = useRecoilValue(searchResultsAtom);
    const resetSearchResults = useSetRecoilState(searchResultsAtom);
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
    const [liked, setLiked] = useState(false);
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
                const boardsResponse = await axios.get("http://localhost:7070/board", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBoards(boardsResponse.data);

                const postResponse = await axios.get(`http://localhost:7070/board/${bodNum}`, {
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
        console.log("useEffect: 현재 배열:", currentArray);
        console.log("useEffect: 현재 bodNum:", bodNum);

        // currentIndex 설정
        const index = currentArray.findIndex((post) => post.bodNum === bodNum);
        if (index === -1) {
            console.error("현재 bodNum이 배열에 없습니다:", bodNum, currentArray);
            setCurrentIndex(null);
        } else {
            console.log("현재 게시글 인덱스:", index);
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
        } else {
            console.error("이전 게시글을 찾을 수 없습니다.");
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
        } else {
            console.error("다음 게시글을 찾을 수 없습니다.");
        }
    };


    useEffect(() => {
        console.log("searchResults 상태:", searchResults);
        console.log("boards 상태:", boards);
        console.log("currentIndex 상태:", currentIndex);
    }, [searchResults, boards, currentIndex]);

    useEffect(() => {
        const currentArray = getCurrentArray();
        console.log("useEffect: 현재 배열:", currentArray);
        console.log("useEffect: 현재 bodNum:", bodNum);

        const index = currentArray.findIndex((post) => post.bodNum === bodNum);
        if (index === -1) {
            console.error("현재 bodNum이 배열에 없습니다:", bodNum, currentArray);
            setCurrentIndex(null);
        } else {
            console.log("현재 게시글 인덱스:", index);
            setCurrentIndex(index);
        }
    }, [bodNum, searchResults, boards]);




    // 페이지 이동 시 reset 호출
    const goToBoard = () => {
        resetSearchResults([]); // 검색 결과 초기화
        navigate("/board"); // 전체 리스트로 이동
    };


    //좋아요 카운트 서버에서 가져오는 함수
    const fetchLikeCount = async () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        try {
            const response = await axios.get(`http://localhost:7070/heart/${bodNum}/likeCount`, {
                headers: {
                    Authorization: `Bearer ${token}`, // 인증 토큰
                },
            });
            setLikeCount(response.data); // 서버에서 받은 좋아요 개수를 상태에 저장
        } catch (error) {
            console.error("좋아요 개수 불러오기 실패:", error);
        }
    };

    // 좋아요 토글
    const toggleLike = async () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        console.log("현재 bodNum", bodNum);


        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            // 요청 데이터 로깅
            console.log("요청 데이터:", { userNick: localStorageUserNick, bodNum: parseInt(bodNum) });

            // 서버로 요청 전송
            const response = await axios.post(
                "http://localhost:7070/heart",
                {
                    userNick: localStorageUserNick, // 사용자 닉네임
                    bodNum: parseInt(bodNum),      // 게시물 번호
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // 인증 토큰
                    },
                }
            );

            console.log("서버 응답:", response.data); // 서버 응답 로깅

            // 서버 응답 처리
            if (response.data === "좋아요가 추가되었습니다.") {
                // 좋아요 추가
                setLiked(true);
                setLikeCount((prev) => prev + 1);
            } else if (response.data === "좋아요가 취소되었습니다.") {
                // 좋아요 취소
                setLiked(false);
                setLikeCount((prev) => Math.max(prev - 1, 0));
            } else {
                console.error("예상치 못한 서버 응답:", response.data);
                alert("예상치 못한 문제가 발생했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            // 오류 처리
            console.error("좋아요 처리 실패:", error.response?.data || error.message);
            alert("좋아요 처리 중 오류가 발생했습니다.");
        }
    };

    // 페이지 로드 시 좋아요 개수 초기화
    useEffect(() => {
        fetchLikeCount();

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
                await axios.delete(`http://localhost:7070/board/${bodNum}`, {
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
                <div className="postInfo">
                    <span>작성자: {board.project?.userNick || "알 수 없음"}</span>
                    <span>작성일: {board.writeDate ? new Date(board.writeDate).toLocaleString() : "알 수 없음"}</span>
                    <span>조회수: {board.views}</span>
                </div>
                <div className="postContent">{board.bodDtail}</div>
                <div className="likeSection postInfoicon">
                    <div>
                    <span
                        className="likeIcon"
                        onClick={toggleLike}
                        style={{ cursor: "pointer", fontSize: "1.5rem" }}
                    >
                        <FaRegThumbsUp color="gray" />
                    </span>
                    좋아요: {likeCount}
                    </div>
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
                    {isMobile &&(
                        <button onClick={goToBoard}>목록</button>
                    )}
                    {!isMobile &&(
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
