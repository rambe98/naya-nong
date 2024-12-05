import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import '../../css/PostDetail.css';
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";

const PostDetail = () => {
    const navigate = useNavigate()

    // 세션 스토리지에서 가져온 userNick 값
    const sessionUserNick = sessionStorage.getItem("userNick")

    //url에서 bodNum 받아오기
    const { bodNum } = useParams()

    const [board, setBoard] = useState({
        bodTitle: "",
        writeDate: "",
        views: 0,
        bodDtail: "",
        likeCount: 0,
        project: {
            userNick: "알 수 없음",
        },
    })
    const [likeCount, setLikeCount] = useState(0); //좋아요 수
    const [liked, setLiked] = useState(false); //좋아요 여부
    const [boards, setBoards] = useState([]) // 모든 게시글 목록
    const [loading, setLoading] = useState(true) // 로딩 상태
    const [currentIndex, setCurrentIndex] = useState(null) // 현재 게시글의 index

    //페이지가 렌더링되면 초기 좋아요수 가져오는 함수
    useEffect(() => {
        const fetchlikeCount = async () => {
            try {
                const response = await axios.get(`http://localhost:7070/heart/${bodNum}/likeCount`);
                setLikeCount(response.data);
                console.log("데이터: ", response.data);
                console.log("현재 bodNum", bodNum);


            } catch (error) {
                console.log(error);
            }
        }
        fetchlikeCount();
    }, [bodNum])

    //좋아요 토글 함수
    const toggleLike = async () => {
        try {
            const response = await axios.post("http://localhost:7070/heart", {
                userNick: sessionUserNick,
                bodNum: parseInt(bodNum),
            });

            if (response.data === "좋아요가 추가되었습니다.") {
                setLiked(true); //좋아요 상태 업데이트
                setLikeCount((prev) => prev + 1); //좋아요 수 1증가
            } else if (response.data === "좋아요가 취소되었습니다.") {
                setLiked(false);
                setLikeCount((prev) => prev - 1); //좋아요 수 1감소
            }
        } catch (error) {
            console.log("좋아요 에러 발생 : ", error);

        }
    }

    useEffect(() => {

        //게시글 불러오는 함수
        const getBoardData = async () => {
            try {
                const boardsResponse = await axios.get("http://localhost:7070/board")
                setBoards(boardsResponse.data)

                const response = await axios.get(`http://localhost:7070/board/${bodNum}`)
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

    if (loading) {
        return <p>로딩 중입니다...</p>;
    }

    if (!board) {
        return <p>게시글을 찾을 수 없습니다.</p>;
    }

    // 게시글 내용 수정
    const handleUpdate = () => {
        // 게시글 작성자 userNick과 현재 사용자의 userNick 비교
        console.log('게시글 작성자 userNick:', board.project.userNick) // 게시글 작성자 userNick 확인
        console.log('현재 사용자 userNick:', sessionUserNick) // 현재 사용자 userNick 확인

        // 게시글 작성자의 userNick과 현재 이용자의 userNick을 비교
        if (board.project.userNick !== sessionUserNick) {
            alert("수정 권한이 없습니다. 작성자만 수정할 수 있습니다.")
            return
        }
        navigate(`/update/${board.bodNum}`)
    }

    //게시글 삭제
    const handleDelete = async () => {
        try {
            // 게시글 작성자 userNick과 현재 사용자의 userNick 비교
            console.log('게시글 작성자 userNick:', board.project.userNick) // 게시글 작성자 userNick 확인
            console.log('현재 사용자 userNick:', sessionUserNick) // 현재 사용자 userNick 확인

            // 게시글 작성자의 userNick과 현재 이용자의 userNick을 비교
            if (board.project.userNick !== sessionUserNick) {
                alert("삭제 권한이 없습니다. 작성자만 삭제할 수 있습니다.")
                return
            }

            // 삭제 확인 후 삭제 진행
            if (window.confirm('게시글을 삭제하시겠습니까?')) {
                // bodNum이 제대로 전달되는지 확인
                console.log('게시글 삭제 요청, bodNum:', bodNum)

                // 게시글 삭제 요청
                const deleteResponse = await axios.delete(`http://localhost:7070/board/${bodNum}`);
                console.log('삭제 요청 후 응답:', deleteResponse)// 응답 데이터 확인

                // 응답 데이터 확인 후 처리
                if (deleteResponse.data) {
                    alert('삭제되었습니다.')
                    navigate("/board"); // 삭제 후 게시글 목록 페이지로 이동
                } else {
                    alert('삭제되지 않았습니다.')
                }
            }
        } catch (error) {
            console.error("게시글 삭제 중 오류 발생:", error)
            alert("게시글 삭제 중 오류가 발생했습니다.")
        }
    }

    //다음 게시글 가져오는 함수
    const handleNext = () => {
        // 이전 게시글의 index가 존재하고, 범위 내에 있는지 확인
        if (currentIndex !== null && currentIndex > 0) {
            const nextPostId = boards[currentIndex - 1].bodNum // 다음 게시글 ID
            navigate(`/board/${nextPostId}`); // 다음 게시글로 이동
        } else {
            alert("마지막 게시글입니다.")
        }
    };

    //이전 게시글 가져오는 함수
    const handleBack = () => {
        // 다음 게시글의 index가 존재하고, 범위 내에 있는지 확인
        if (currentIndex !== null && currentIndex < boards.length - 1) {
            const backPostId = boards[currentIndex + 1].bodNum // 이전 게시글 ID
            navigate(`/board/${backPostId}`); // 이전 게시글로 이동
        } else {
            alert("이전 게시글이 없습니다.")
        }
    };


    return (
        <div className="postDetailContainer">
            <div className="postDetailContent">
                <h2 className="postTitle">{board.bodTitle}</h2>
                <div className="postInfo">
                    <span>작성자 : {board.userNick}</span>
                    <span>작성일자 : {board.writeDate}</span>
                    <span>조회수: {board.views}</span>
                </div>
                <div className="postContent">{board.bodDtail}</div>
                <div className="postInfo">
                    <span><span
                        onClick={toggleLike}
                        className="likeIcon"
                        style={{ cursor: "pointer", marginLeft: "10px", fontSize: "1.5rem", }}
                    >
                        {liked ? <FaThumbsUp color="lightblue" /> : <FaRegThumbsUp color="gray" />}
                    </span>좋아요: {likeCount} </span>
                </div>
                {board.project.userNick === sessionUserNick && (
                    <button onClick={handleDelete}>삭제</button>
                )}
                {currentIndex > 0 && (
                    <button onClick={handleNext}>다음</button>
                )}
                <button onClick={handleBack}>이전</button>
                <button onClick={() => navigate("/board")} >목록으로</button>
                <button onClick={handleUpdate}>수정</button>
            </div>
        </div>
    );
};

export default PostDetail