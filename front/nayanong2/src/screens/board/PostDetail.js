
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import '../../css/PostDetail.css';

const PostDetail = () => {
    const navigate = useNavigate();

    // 세션 스토리지에서 가져온 userNick 값
    const sessionUserNick = sessionStorage.getItem("userNick")

    //url에서 bodNum 받아오기
    const { bodNum } = useParams();

    const [board, setBoard] = useState({
        bodTitle: "",
        writeDate: "",
        views: 0,
        bodDtail: "",
        likeCount: 0,
        project: {
            userNick: "알 수 없음",
        },
    });
    const [boards, setBoards] = useState([]); // 모든 게시글 목록
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [currentIndex, setCurrentIndex] = useState(null); // 현재 게시글의 index

    useEffect(() => {

        //게시글 불러오는 함수
        const getBoardData = async () => {
            try {
                const boardsResponse = await axios.get("http://localhost:7070/board");
                setBoards(boardsResponse.data);

                const response = await axios.get(`http://localhost:7070/board/${bodNum}`);
                console.log("서버 응답 데이터:", response.data);
                const data = response.data
                const updateData = { ...data, project: { userNick: data.userNick } }
                setBoard(updateData); // 게시글 데이터 설정

                // 현재 게시글의 index를 찾아서 저장
                const index = boardsResponse.data.findIndex((b) => b.bodNum === parseInt(bodNum));
                setCurrentIndex(index)
            } catch (error) {
                console.error("게시글 데이터를 불러오는 중 오류 발생:", error);
                alert("게시글을 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        getBoardData();
    }, [bodNum]);

    if (loading) {
        return <p>로딩 중입니다...</p>;
    }

    if (!board) {
        return <p>게시글을 찾을 수 없습니다.</p>;
    }

    //게시글 삭제
    const handleDelete = async () => {
        try {
            // 게시글 작성자 userNick과 현재 사용자의 userNick 비교
            console.log('게시글 작성자 userNick:', board.project.userNick); // 게시글 작성자 userNick 확인
            console.log('현재 사용자 userNick:', sessionUserNick); // 현재 사용자 userNick 확인

            // 게시글 작성자의 userNick과 현재 이용자의 userNick을 비교
            if (board.project.userNick !== sessionUserNick) {
                alert("삭제 권한이 없습니다. 작성자만 삭제할 수 있습니다.");
                return;
            }

            // 삭제 확인 후 삭제 진행
            if (window.confirm('게시글을 삭제하시겠습니까?')) {
                // bodNum이 제대로 전달되는지 확인
                console.log('게시글 삭제 요청, bodNum:', bodNum);

                // 게시글 삭제 요청
                const deleteResponse = await axios.delete(`http://localhost:7070/board/${bodNum}`);
                console.log('삭제 요청 후 응답:', deleteResponse); // 응답 데이터 확인

                // 응답 데이터 확인 후 처리
                if (deleteResponse.data) {
                    alert('삭제되었습니다.');
                    navigate("/board"); // 삭제 후 게시글 목록 페이지로 이동
                } else {
                    alert('삭제되지 않았습니다.');
                }
            }
        } catch (error) {
            console.error("게시글 삭제 중 오류 발생:", error);
            alert("게시글 삭제 중 오류가 발생했습니다.");
        }
    }

    const handleNext = () => {
        // 이전 게시글의 index가 존재하고, 범위 내에 있는지 확인
        if (currentIndex !== null && currentIndex > 0) {
            const nextPostId = boards[currentIndex - 1].bodNum; // 다음 게시글 ID
            navigate(`/board/${nextPostId}`); // 다음 게시글로 이동
        } else {
            alert("마지막 게시글입니다.");
        }
    };

    const handleBack = () => {
        // 다음 게시글의 index가 존재하고, 범위 내에 있는지 확인
        if (currentIndex !== null && currentIndex < boards.length - 1) {
            const backPostId = boards[currentIndex + 1].bodNum; // 이전 게시글 ID
            navigate(`/board/${backPostId}`); // 이전 게시글로 이동
        } else {
            alert("이전 게시글이 없습니다.");
        }
    };

    return (
        <div className="postDetailContainer">
            <div className="postDetailContent">
                <h2 className="postTitle">{board.bodTitle}</h2>
                <div className="postInfo">
                    <span>{board.userNick}</span>
                    <span>{board.writeDate}</span>
                    <span>조회수: {board.views}</span>
                </div>
                <div className="postContent">{board.bodDtail}</div>
                <div className="postInfo">
                    <span>좋아요: {board.likeCount}</span>
                </div>
                <div className="postButtonGroup">
                    {/* 이전 버튼 */}
                    <button onClick={handleBack} className="postBackButton">이전</button>
                    {/* 다음 버튼 */}
                    <button onClick={handleNext} className="postNextButton">다음</button>
                    {/* 삭제 버튼: 작성자인 경우만 활성화 */}
                    <button
                        onClick={handleDelete}
                        className="postDeleteButton"
                        style={{ visibility: board.project.userNick === sessionUserNick ? "visible" : "hidden" }}
                    >
                        삭제
                    </button>
                    {/* 목록으로 버튼 */}
                    <button onClick={() => navigate("/board")} className="postListButton">목록으로</button>
                </div>

            </div>
        </div>
    );


};

export default PostDetail;