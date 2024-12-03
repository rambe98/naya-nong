import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import '../../css/PostDetail.css';

const PostDetail = () => {
    const navigate = useNavigate();
    const { bodNum } = useParams();

    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBoardData = async () => {
            try {
                const response = await axios.get(`http://localhost:7070/board/${bodNum}`);
                console.log("서버 응답 데이터:", response.data);
                setBoard(response.data); // 데이터가 단일 객체로 반환된다고 가정
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

      const handleDelete = async () => {
        if (window.confirm('게시글을 삭제하시겟습니까?')) {
            const response = await axios.delete(`http://localhost:7070/board/${bodNum}`)
            if (response.data) {
                console.log('handleDelete : ', response.data);
                alert('삭제되었습니다.')
                navigate("/board")
            } else {
                alert('삭제되지 않았습니다.')
            }
        }
    }

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
             <button onClick={handleDelete}>삭제</button>
            </div>
        </div>
    );
};

export default PostDetail;
