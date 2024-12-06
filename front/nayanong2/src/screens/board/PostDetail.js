import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import '../../css/PostDetail.css';
import '../../css/Comment.css'
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { userNickAtom } from "../../recoil/UserRecoil";
import { SiAnsys } from "react-icons/si";

const PostDetail = () => {
    const navigate = useNavigate()

    // 로컬 스토리지에서 가져온 userNick 값
    const localStorageUserNick = localStorage.getItem("userNick")

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
    const [comments, setComments] = useState([]); // 댓글 목록
    const [newComment, setNewComment] = useState(""); // 새 댓글
    const [editingCommentId, setEditingCommentId] = useState(null); //수정모드
    const [editingCommentContent, setEditingCommentContent] = useState(""); //수정모드의 입력필드
    const [replyingTo, setReplyingTo] = useState(null); // 대댓글 작성 대상 ID
    const [newReply, setNewReply] = useState(""); // 대댓글 내용

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
        const token = localStorage.getItem("ACCESS_TOKEN")
        try {
            const response = await axios.post("http://localhost:7070/heart", {
                userNick: localStorageUserNick,
                bodNum: parseInt(bodNum),
                headers: {
                    Authorization: `Bearer ${token}`, // 인증 토큰 추가
                },
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

    //bodNum이 있다면 페이지가 렌더링 될 때상세 게시글 불러오는 함수
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

    // 페이지 로드 시 댓글 목록 불러오기
    useEffect(() => {
        commentsget();
    }, []);

    // 게시글 내용 수정
    const handleUpdate = () => {
        // 게시글 작성자 userNick과 현재 사용자의 userNick 비교
        console.log('게시글 작성자 userNick:', board.project.userNick) // 게시글 작성자 userNick 확인
        console.log('현재 사용자 userNick:', localStorageUserNick) // 현재 사용자 userNick 확인

        // 게시글 작성자의 userNick과 현재 이용자의 userNick을 비교
        if (board.project.userNick !== localStorageUserNick) {
            alert("수정 권한이 없습니다. 작성자만 수정할 수 있습니다.")
            return
        }
        navigate(`/update/${board.bodNum}`)
    }

    //게시글 삭제
    const handleDelete = async () => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        try {
            // 게시글 작성자 userNick과 현재 사용자의 userNick 비교
            console.log('게시글 작성자 userNick:', board.project.userNick) // 게시글 작성자 userNick 확인
            console.log('현재 사용자 userNick:', localStorageUserNick) // 현재 사용자 userNick 확인

            // 게시글 작성자의 userNick과 현재 이용자의 userNick을 비교
            if (board.project.userNick !== localStorageUserNick) {
                alert("삭제 권한이 없습니다. 작성자만 삭제할 수 있습니다.")
                return
            }

            // 삭제 확인 후 삭제 진행
            if (window.confirm('게시글을 삭제하시겠습니까?')) {
                // bodNum이 제대로 전달되는지 확인
                console.log('게시글 삭제 요청, bodNum:', bodNum)

                // 게시글 삭제 요청
                const deleteResponse = await axios.delete(`http://localhost:7070/board/${bodNum}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // 인증 토큰 추가
                    },
                });
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

    //댓글이 입력되면 리렌더링
    useEffect(() => {
        commentsget();
    })

    //페이지가 렌더링 되면 댓글 리스트 출력
        const commentsget = async () => {
            const token = localStorage.getItem('ACCESS_TOKEN');
            console.log("보드넘", bodNum);
            
            try {
                const response = await axios.get(`http://localhost:7070/comments/${bodNum}`, {
                    bodNum : bodNum,
                    headers: {
                        Authorization: `Bearer ${token}`, // 인증 토큰 추가
                    },
                });
                console.log("현재데이터야", response.data); // 응답 데이터 로그
                const reversedComments = [...response.data].reverse(); //배열상태의 데이터를 복사후 반전
                setComments(reversedComments); //상태 업데이트
                console.log(reversedComments);
    
            } catch (error) {
                console.error("댓글리스트 불러오기 실패:", error); // 오류 로그
            }
        };



    //댓글추가(작성)
    const commentsAdd = async () => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        try {
            const response = await axios.post(`http://localhost:7070/comments/add`, {
                content: newComment, //댓글 내용
                userNick: localStorageUserNick, //세션스토리지의 유저닉네임값
                bodNum: parseInt(bodNum)//url에서 따온 bodNum을 정수형으로 반환
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // 인증 토큰 추가
                    },
                })
            console.log("댓글 추가 성공", response.data);
            alert("댓글이 추가되었습니다.")

            setNewComment('');
            commentsget();
        } catch (error) {
            console.log("댓글 추가 에러", error);
            alert("댓글추가 실패")
        }

    };

    // 댓글 삭제
    const commentsDelete = async (comId) => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        try {
            // 사용자에게 삭제 확인 메시지 표시
            const userConfirmed = window.confirm(
                '댓글을 삭제하시겠습니까? 삭제된 댓글은 복구할 수 없습니다.'
            );

            // 사용자가 확인 버튼을 눌렀을 경우에만 삭제 진행
            if (userConfirmed) {
                const response = await axios.delete(`http://localhost:7070/comments/delete/${comId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // 인증 토큰 추가
                        },
                    });
                console.log("댓글 삭제 성공:", response.data);
                alert("댓글이 삭제되었습니다.");
                commentsget(); // 댓글 목록 새로고침
            } else {
                console.log("사용자가 댓글 삭제를 취소했습니다.");
            }
        } catch (error) {
            console.error("댓글 삭제 실패:", error);
            alert("댓글 삭제에 실패했습니다.");
        }
    };

    //댓글 수정
    const commentsPut = async (comId, updatedContent) => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        try {
            const response = await axios.put(`http://localhost:7070/comments/update/${comId}`, {
                content: updatedContent,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // 인증 토큰 추가
                },
            });
            console.log("댓글 수정 성공:", response.data);
            alert("댓글이 수정되었습니다.");
            setEditingCommentId(null); // 수정 모드 종료
            setEditingCommentContent(""); // 입력 필드 초기화
            commentsget(); // 수정 후 댓글 목록 새로고침
        } catch (error) {
            console.error("댓글 수정 실패:", error);
            alert("댓글 수정에 실패했습니다.");
        }
    };

    // 대댓글 작성
    const replyAdd = async (parentId) => {
        if (!newReply.trim()) return alert("답글 내용을 입력하세요.");
        const token = localStorage.getItem('ACCESS_TOKEN');
        try {
            const response = await axios.post(`http://localhost:7070/pComment/addReply/${parentId}`, {
                content: newReply,
                userNick: localStorageUserNick,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // 인증 토큰 추가
                },
            });
            // 부모 댓글에 대댓글 추가
            setComments(
                comments.map((comment) =>
                    comment.comId === parentId
                        ? { ...comment, replies: [...(comment.replies || []), response.data] }
                        : comment
                )
            );
            setNewReply(""); // 입력 필드 초기화
            setReplyingTo(null); // 대댓글 모드 종료
        } catch (error) {
            console.error("대댓글 작성 중 오류 발생:", error);
        }
    };

    // 대댓글 삭제
    const replyDelete = async (pComId) => {

        console.log("Deleting reply with ID:", pComId); // pComId 값 확인
        try {
            const userConfirmed = window.confirm('대댓글을 삭제하시겠습니까? 삭제된 대댓글은 복구할 수 없습니다.');

            if (userConfirmed) {
                const response = await axios.delete(`http://localhost:7070/pComment/delete/${pComId}`);
                console.log("대댓글 삭제 성공:", response.data);
                alert("대댓글이 삭제되었습니다.");
                commentsget(); // 댓글 목록 새로고침
            } else {
                console.log("사용자가 대댓글 삭제를 취소했습니다.");
            }
        } catch (error) {
            console.error("대댓글 삭제 실패:", error);
            alert("대댓글 삭제에 실패했습니다.");
        }
    };



    //로딩중
    if (loading) {
        return <p>로딩 중입니다...</p>;
    }
    //게시글이 없을때 나타나는 메시지
    if (!board) {
        return <p>게시글을 찾을 수 없습니다.</p>;
    }


    return (
        <div className="postDetailContainer">
            <div className="postDetailContent">
                <h2 className="postTitle">{board.bodTitle}</h2>
                <div className="postInfo">
                    <span>작성자 : {board.userNick}</span>
                    <span>작성일자 : {new Date(board.writeDate).toLocaleString()}</span>
                    <span>조회수: {board.views}</span>
                </div>
                <div className="postContent">{board.bodDtail}</div>
                <div className="postInfo">
                    <span>
                        <span
                            onClick={toggleLike}
                            className="likeIcon"
                            style={{ cursor: "pointer", marginLeft: "10px", fontSize: "1.5rem" }}
                        >
                            {liked ? <FaThumbsUp color="lightblue" /> : <FaRegThumbsUp color="gray" />}
                        </span>
                        좋아요: {likeCount}
                    </span>
                </div>
                <div className="postButtonLargeRow">

                    <button onClick={handleBack}>이전</button>
                    {currentIndex > 0 && <button onClick={handleNext}>다음</button>}
                    {board.project.userNick === localStorageUserNick && (
                        <button onClick={handleUpdate}>수정</button>
                    )}
                    {board.project.userNick === localStorageUserNick && (
                        <button onClick={handleDelete}>삭제</button>
                    )}
                    <button onClick={() => navigate("/board")}>목록으로</button>
                </div>
            </div>
            {/* 댓글 */}
            <div className="commentsContainer">
                <h3>댓글</h3>
                <div className="commentInput">
                    <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                commentsAdd(); // 엔터 키가 눌렸을 때 댓글 작성 함수 호출
                            }
                        }}
                    />
                    <button onClick={commentsAdd}>댓글 작성</button>
                </div>
                {/* 댓글목록 */}
                {/* 댓글목록 */}
                <div className="commentList">
                    {comments.map((comment) => {
                        const createTime = new Date(comment.createDate).toLocaleString(); // 작성일자 변환
                        const updateTime = comment.updateDate
                            ? new Date(comment.updateDate).toLocaleString() // 수정일자 변환
                            : null; // 수정일자가 없는 경우

                        return (
                            <div key={comment.comId} className="commentItem">
                                {/* editingCommentId가 comId와 같을 때 수정 모드 진입 */}
                                {editingCommentId === comment.comId ? (
                                    <div className="editInputWrapper">
                                        <input
                                            className="commonInput"
                                            value={editingCommentContent}
                                            onChange={(e) => setEditingCommentContent(e.target.value)}
                                        />
                                        <div className="actionButtons">
                                            <button
                                                onClick={() => commentsPut(comment.comId, editingCommentContent)}
                                            >
                                                확인
                                            </button>
                                            <button onClick={() => setEditingCommentId(null)}>취소</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p>
                                            {/* 작성자 : 내용 */}
                                            <strong>{comment.userNick}:</strong> {comment.content}
                                        </p>
                                        {/* 작성일자 */}
                                        {!updateTime && <span>  작성일자: {createTime}</span>}


                                        {/* 수정일자가 있을 경우에만 표시 */}
                                        {updateTime && <span>수정일자: {updateTime}</span>}
                                        <div className="commentButtons">
                                            {/* 작성자의 유저닉네임과 현재 세션스토리지에 저장된 유저닉이 같으면 수정 모드 진입 */}
                                            {comment.userNick === localStorageUserNick && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditingCommentId(comment.comId);
                                                            setEditingCommentContent(comment.content);
                                                        }}
                                                    >
                                                        수정
                                                    </button>
                                                    {/* 매개변수로 댓글의 comId를 보내고 작성자의 유저닉과 현재 로그인된 세션스토리지의 유저닉이 같으면 삭제 */}
                                                    <button onClick={() => commentsDelete(comment.comId)}>삭제</button>
                                                </>
                                            )}
                                            <button onClick={() => setReplyingTo(comment.comId)}>답글</button>
                                        </div>
                                    </div>
                                )}
                                {replyingTo === comment.comId && (
                                    <div className="replyInputWrapper">
                                        <input
                                            className="commonInput"
                                            value={newReply}
                                            onChange={(e) => setNewReply(e.target.value)}
                                            placeholder="답글을 입력하세요."
                                        />
                                        <div className="actionButtons">
                                            <button onClick={() => replyAdd(comment.comId)}>작성</button>
                                            <button onClick={() => setReplyingTo(null)}>취소</button>
                                        </div>
                                    </div>
                                )}
                                <div className="replies">
                                    {comment.replies &&
                                        comment.replies.map((reply) => {
                                            const replyTime = new Date(reply.createDate).toLocaleString();
                                            return (
                                                <div key={reply.pComId} className="replyItem">
                                                    <p>
                                                        <strong>{reply.userNick}:</strong> {reply.content}
                                                        <span>작성일자 : {replyTime}</span>
                                                    </p>
                                                    <button onClick={() => replyDelete(reply.pComId)}>삭제</button>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

}


export default PostDetail;