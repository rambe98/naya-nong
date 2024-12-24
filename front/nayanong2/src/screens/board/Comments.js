import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../css/Comment.css';
import { useRecoilValue } from "recoil";
import { bodNumAtom } from "../../recoil/BoardRecoil";
import { API_BASE_URL } from '../../service/api-config';

const Comments = () => {
    const bodNum = useRecoilValue(bodNumAtom); // 리코일 상태 구독
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [newReply, setNewReply] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const token = localStorage.getItem('ACCESS_TOKEN');
    const localStorageUserNick = localStorage.getItem("userNick");

    useEffect(() => {
        if (bodNum) {
            fetchComments();
        }
    }, [bodNum]);

    // 댓글 조회
    const fetchComments = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/comments/${bodNum}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            const commentsData = response.data.reverse(); // 댓글 데이터 가져오기
    
            const commentsWithReplies = await Promise.all(
                commentsData.map(async (comment) => {
                    const repliesResponse = await axios.get(
                        `${API_BASE_URL}/pComment/${comment.comId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    return { ...comment, replies: repliesResponse.data.reverse() || [] };
                })
            );
            setComments(commentsWithReplies);
        } catch (error) {
            console.error("댓글 및 대댓글 데이터 로드 실패:", error);
        }
    };
    
    
    //댓글 추가
    const commentsAdd = async () => {
        const loginsuccess = localStorage.getItem("ACCESS_TOKEN") ? true : false;

        if (!loginsuccess) {
            alert('로그인이 필요합니다.');
            return;
        }
        if (!newComment.trim()) return alert("댓글 내용을 입력하세요.");
        try {
            await axios.post(`${API_BASE_URL}/comments/add`, {
                content: newComment,
                userNick: localStorageUserNick,
                bodNum: parseInt(bodNum),
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
         
            alert("댓글이 작성되었습니다.")
            setNewComment("");
            fetchComments();
        } catch (error) {
            console.error("댓글 추가 실패:", error);
        }
    };
    //댓글 삭제
    const commentsDelete = async (comId) => {
        try {
            const confirmed = window.confirm("댓글을 삭제하시겠습니까?");
            if (!confirmed) return;
    
            await axios.delete(`${API_BASE_URL}/comments/delete/${comId}`, {
                headers: { Authorization: `Bearer ${token}` }, 
            });
            fetchComments();
        } catch (error) {
            console.error("댓글 삭제 실패:", error);
        }
    };
    // 댓글 수정
    const commentsPut = async (comId, updatedContent) => {
        if (!updatedContent.trim()) return alert("수정할 댓글 내용을 입력하세요.");
        try {
            await axios.put(`${API_BASE_URL}/comments/update/${comId}`, {
                content: updatedContent,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEditingCommentId(null);
            setEditingCommentContent("");
            fetchComments();
        } catch (error) {
            console.error("댓글 수정 실패:", error);
        }
    };
    
    //대댓글 추가
    const replyAdd = async (parentId) => {
        const loginsuccess = localStorage.getItem("ACCESS_TOKEN") ? true : false;
        if (!loginsuccess) {
            alert('로그인이 필요합니다.');
            return;
        }
        if (!newReply.trim()) return alert("답글 내용을 입력하세요.");
        try {
            await axios.post(`${API_BASE_URL}/pComment/addReply/${parentId}`, {
                content: newReply,
                userNick: localStorageUserNick,
            }, {
                headers: { Authorization: `Bearer ${token}` }, 
            });
            setNewReply("");
            setReplyingTo(null);
            fetchComments();
        } catch (error) {
            console.error("답글 추가 실패:", error);
        }
    };
    
    // 대댓글 삭제
    const replyDelete = async (pcomId) => {
        try {
            const confirmed = window.confirm("답글을 삭제하시겠습니까?");
            if (!confirmed) return;
            await axios.delete(`${API_BASE_URL}/pComment/delete/${pcomId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchComments();
            alert("답글이 삭제되었습니다.")
        } catch (error) {
            console.error("답글 삭제 실패:", error);
        }
    };
    

    return (
        <div className="commentsContainer">
            <h3>댓글</h3>
            <div className="commentInput">
                <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            commentsAdd();
                        }
                    }}
                />
                <button onClick={commentsAdd}>댓글 작성</button>
            </div>
    
            {/* 댓글 목록 */}
            <div className="commentList">
                {comments.map((comment) => {
                    const createTime = new Date(comment.createDate).toLocaleString();
                    const updateTime = comment.updateDate
                        ? new Date(comment.updateDate).toLocaleString()
                        : null;
    
                    return (
                        <div key={comment.comId} className="commentItem">
                            {/* 댓글 수정 중 */}
                            {editingCommentId === comment.comId ? (
                                <div className="editInputWrapper">
                                    <input
                                        className="commonInput"
                                        value={editingCommentContent}
                                        onChange={(e) => setEditingCommentContent(e.target.value)}
                                    />
                                    <div className="actionButtons">
                                        <button onClick={() => commentsPut(comment.comId, editingCommentContent)}>
                                            확인
                                        </button>
                                        <button onClick={() => setEditingCommentId(null)}>취소</button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {/* 댓글 내용 */}
                                    <p>
                                        <strong>{comment.userNick}:</strong> {comment.content}
                                    </p>
                                    <span>작성일자: {createTime}</span>
                                    {updateTime && <span>수정일자: {updateTime}</span>}
    
                                    {/* 댓글 액션 버튼 */}
                                    <div className="commentButtons">
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
                                                <button onClick={() => commentsDelete(comment.comId)}>삭제</button>
                                            </>
                                        )}
                                        <button onClick={() => setReplyingTo(comment.comId)}>답글</button>
                                    </div>
                                </div>
                            )}
    
                            {/* 답글 입력 */}
                            {replyingTo === comment.comId && (
                                <div className="replyInputWrapper">
                                    <input
                                        className="commonInput"
                                        value={newReply}
                                        onChange={(e) => setNewReply(e.target.value)}
                                        placeholder="답글을 입력하세요."
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                replyAdd(comment.comId);
                                            }
                                        }}
                                    />
                                    <div className="actionButtons">
                                        <button onClick={() => replyAdd(comment.comId)}>작성</button>
                                        <button onClick={() => setReplyingTo(null)}>취소</button>
                                    </div>
                                </div>
                            )}
    
                            {/* 대댓글 목록 */}
                            <div className="replies">
                                {comment.replies.map((reply) => {
                                    const replyTime = new Date(reply.createDate).toLocaleString();
                                    return (
                                        <div key={reply.pcomId} className="replyItem">
                                            <p>
                                                <strong>{reply.userNick}:</strong> {reply.content}
                                            </p>
                                            <span>작성일자: {replyTime}</span>
                                            {reply.userNick === localStorageUserNick && (
                                                <button className="deleteButton" onClick={() => replyDelete(reply.pcomId)}>삭제</button>
                                            )}
                                        </div>
                                    );
                                    
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
    
};

export default Comments;