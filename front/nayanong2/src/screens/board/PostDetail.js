import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import '../../css/PostDetail.css';
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { useSetRecoilState } from "recoil";
import { bodNumAtom } from "../../recoil/BoardRecoil"; // Recoil 상태 가져오기
import Comments from "./Comments"; // Comments 컴포넌트 추가

const PostDetail = () => {
    const navigate = useNavigate();
    const { bodNum } = useParams();
    const setBodNum = useSetRecoilState(bodNumAtom); // Recoil 상태 업데이트 함수
    const localStorageUserNick = localStorage.getItem("userNick");

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

    //게시글 가져오는 함수
    useEffect(() => {
        const getBoardData = async () => {
            const token = localStorage.getItem('ACCESS_TOKEN');
            try {
                const boardsResponse = await axios.get("http://localhost:7070/board", {
                    headers: {
                        Authorization: `Bearer ${token}`, // 인증 토큰 추가
                    },
                })
                setBoards(boardsResponse.data)

                const response = await axios.get(`http://localhost:7070/board/${bodNum}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // 인증 토큰 추가
                    },
                })
                console.log("서버 응답 데이터:", response.data)
                const data = response.data
                const updateData = { ...data, project: { userNick: data.userNick } }
                setBoard(updateData) // 게시글 데이터 설정

                // 현재 게시글의 index를 찾아서 저장
                // boardsResponse.data : 서버에서 받아온 게시글 정보가 들어있는 배열
                // (item) : 각 배열의 요소 , 각 게시글 하나하나를 나타냄
                // item.bodNum : 각 게시글의 bodNum
                // parseInt(bodNum) : 찾으려는 게시글의 bodNum을 숫자로 변환
                // findIndex((item) => item.bodNum === bodNum) : 
                // 전체 게시글 배열에서 찾으려는 bodNum과 일치하는 게시글을 찾아 그 인덱스를 반환
                const index = boardsResponse.data.findIndex((item) => item.bodNum === parseInt(bodNum))
                // 반환된 index를 상태로 저장하여 currentIndex의 값을 update
                setCurrentIndex(index)
                console.log(index)

            } catch (error) {
                console.error("게시글 데이터를 불러오는 중 오류 발생:", error)
                alert("게시글을 불러오는 데 실패했습니다.")
            } finally {
                setLoading(false)
            }
        }
        getBoardData()
    }, [bodNum]) 

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
        console.log("현재 bodNum",bodNum);
        
    
        if (!token) {
            console.error("ACCESS_TOKEN이 없습니다. 로그인이 필요합니다.");
            alert("로그인이 필요합니다.");
            return;
        }
    
        try {
            // 요청 데이터 로깅
            console.log("요청 데이터:", { userNick: localStorageUserNick, bodNum: parseInt(bodNum) });
    
            // 서버로 요청 전송
            const response = await axios.post(
                "http://localhost:7070/heart/like",
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
            if (response.data === true) {
                // 좋아요 추가
                setLiked(true);
                setLikeCount((prev) => prev + 1);
            } else if (response.data === false) {
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
        if (board.project?.userNick !== localStorageUserNick) {
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
            }
        }
    };

    // 다음/이전 게시글 이동
    const handleNext = () => {
        if (currentIndex > 0) {
            const nextPostId = boards[currentIndex - 1].bodNum;
            navigate(`/board/${nextPostId}`);
        } else {
            alert("마지막 게시글입니다.");
        }
    };

    const handleBack = () => {
        if (currentIndex < boards.length - 1) {
            const backPostId = boards[currentIndex + 1].bodNum;
            navigate(`/board/${backPostId}`);
        } else {
            alert("첫 번째 게시글입니다.");
        }
    };

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
                    <span
                        className="likeIcon"
                        onClick={toggleLike}
                        style={{ cursor: "pointer", fontSize: "1.5rem" }}
                    >
                        {liked ? <FaThumbsUp color="blue" /> : <FaRegThumbsUp color="gray" />}
                    </span>
                    좋아요: {likeCount}
                </div>
                <div className="postButtonLargeRow">
                    <button onClick={handleBack}>이전</button>
                    <button onClick={handleNext}>다음</button>
                    {board.project?.userNick === localStorageUserNick && (
                        <>
                            <button onClick={() => navigate(`/update/${bodNum}`)}>수정</button>
                            <button onClick={handleDelete}>삭제</button>
                        </>
                    )}
                    <button onClick={() => navigate("/board")}>목록으로</button>
                </div>
            </div>
            {/* Comments 컴포넌트 삽입 */}
            <Comments />
        </div>
    );
    
};

export default PostDetail;
