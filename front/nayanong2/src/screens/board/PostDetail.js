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

    // 좋아요 토글
    const toggleLike = async () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        try {
            const response = await axios.post(
                "http://localhost:7070/heart/like",
                { userNick: localStorageUserNick, bodNum: parseInt(bodNum) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            const likedStatus = response.data; // 서버에서 반환된 좋아요 상태 (true or false)
            setLiked(likedStatus); // 좋아요 상태 업데이트
    
            // 서버에서 동기화된 좋아요 수 가져오기
            const likeCountResponse = await axios.get(
                `http://localhost:7070/heart/${bodNum}/likeCount`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setLikeCount(likeCountResponse.data); // 좋아요 수 동기화
        } catch (error) {
            console.error("좋아요 처리 실패:", error);
            alert("좋아요 처리 중 오류가 발생했습니다.");
        }
    };
    
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
