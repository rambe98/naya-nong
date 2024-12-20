import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { userNickAtom } from '../../recoil/UserRecoil';
import '../../css/UpdatePost.css';
import { API_BASE_URL } from '../../service/api-config';

const UpdatePost = () => {
    const navigate = useNavigate();
    const { bodNum } = useParams(); // URL에서 bodNum 받아오기

    const [userNick, setUserNick] = useRecoilState(userNickAtom); // 닉네임 상태

    const [board, setBoard] = useState({
        bodTitle: '',
        bodDtail: '',
    }); // 수정할 게시글 상태

    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태

      //스크롤 없애기
  useEffect(() => {
    // body에 클래스 추가
    document.body.classList.add('no-scroll');

    // 언마운트 시 클래스 제거
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

    // 게시글 데이터를 불러오는 함수
    useEffect(() => {
        const getBoardData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/board/${bodNum}`);
                setBoard(response.data); // 게시글 데이터 설정
            } catch (err) {
                console.error('게시글을 불러오는 중 오류 발생:', err);
                setError('게시글을 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        getBoardData();
    }, [bodNum]);

    const editCompleted = async () => {
        if (!board.bodTitle || board.bodTitle.trim() === '') {
            alert('제목을 입력하세요.');
            return; // 제목이 없으면 수정 불가
        }

        if (!board.bodDtail || board.bodDtail.trim() === '') {
            alert('내용을 입력하세요.');
            return; // 내용이 없으면 수정 불가
        }

        try {
            // PUT 요청을 보내 게시글 수정
            const response = await axios.put(`${API_BASE_URL}/board/${bodNum}`, board);
            if (response.status === 200) {
                if (window.confirm('게시글을 수정하시겠습니까?')) {
                    alert("수정이 완료되었습니다.")
                }else{
                    alert("수정이 취소되었습니다.")
                }
                navigate(`/board/${bodNum}`); // 수정 후 게시글 상세 페이지로 이동
            }
        } catch (err) {
            console.error('게시글 수정에 실패했습니다.', err);
            alert('게시글 수정에 실패했습니다.');
        }
    };

    // 로딩 중이거나 오류가 있는 경우 처리
    if (loading) {
        return <p className="updateLoading">로딩 중입니다...</p>;
    }

    if (error) {
        return <p className="updateError">{error}</p>;
    }

    return (
        <div className="updateContainer">
            <h2>게시글 수정</h2>
            <div className="updateInputContainer">
                <label htmlFor="userNick">닉네임:</label>
                <input
                    id="userNick"
                    type="text"
                    value={board.userNick || userNick} // 기본적으로 사용자 닉네임 표시
                    readOnly
                    className="updateUserNickInput"
                />
            </div>
            <div className="updateInputContainer">
                <label htmlFor="bodTitle">제목:</label>
                <input
                    id="bodTitle"
                    type="text"
                    value={board.bodTitle}
                    onChange={(e) => setBoard({ ...board, bodTitle: e.target.value })}
                    placeholder="게시글 제목"
                    required
                    className="updateInput"
                />
            </div>
            <div className="updateInputContainer">
                <label htmlFor="bodDtail">내용:</label>
                <textarea
                    id="bodDtail"
                    value={board.bodDtail}
                    onChange={(e) => setBoard({ ...board, bodDtail: e.target.value })}
                    placeholder="게시글 내용을 입력하세요."
                    required
                    className="updateInputText"
                />
            </div>
            <div>
                <button onClick={editCompleted} className="updateButton" >
                    완료
                </button>
                <button onClick={() => navigate(`/board/${bodNum}`)} className="updateButton">
                    이전
                </button>
            </div>
        </div>
    );
};

export default UpdatePost;
