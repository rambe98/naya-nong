import React, { useEffect, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../service/api-config';
import '../../css/Qna.css'

const Qna = () => {
    // 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 클릭된 내용 저장
    const [selectedContent, setSelectedContent] = useState('');

    //로컬스토리지에서 유저닉을 가져옴
    const userNick = localStorage.getItem("userNick");

    //로컬스토리지에서 클라이언트넘을 가져옴
    const clientNum = localStorage.getItem("clientNum");

    // QnA 리스트 상태 추가
    const [qnaList, setQnaList] = useState([]);

    //폼데이터를 보내기위한 초기값,
    const [formData, setFormData] = useState({
        userNick: userNick,
        qnaTitle: '',
        qnaDtail: '',
    })
    //작성일자
    const [date, setDate] = useState('');
    const navigate = useNavigate('');

    //날짜 함수
    useEffect(() => {
        const updateDate = () => {
            const currentDate = new Date();
            setDate(currentDate.toLocaleString());
        };
        updateDate(); // 초기 실행
        const interval = setInterval(updateDate, 1000); // 1초마다 실행

        return () => clearInterval(interval);
        // qna페이지에서 나갈때 1초마다 재실행되면 메모리사용을 하니 방지하기 위해
        // clearInterval 사용 즉, 타이머가 멈춘다
    }, [clientNum, navigate])
    // []를 사용하는이유는 페이지가 최초 렌더링 될때 한번만실행해야하고
    // []가 없을경우에는 상태가 변할때마다 업데이트되기때문에 원하는 값이 안나올수있다.(중복된 타이머가 발생)

    //클라이언트넘에 아무런 값이없을때 로그인 이동페이지로 이동하게함 if/else는 확인,취소
    useEffect(() => {
        if (!clientNum) {
            const userConfirmed = window.confirm(
                '로그인을 해야 이용 가능한 서비스입니다. \n로그인 페이지로 이동하시겠습니까?'
            );
            if (userConfirmed) {
                navigate('/login', { state: { from: '/qna' } });
            } else {
                navigate('/');
            }
        }
    }, []);

    //사용자가 입력한 값으로 폼데이터 업데이트
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // userNick이 변경될 때 formData.userNick 동기화
    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            userNick: userNick || "", // userNick을 업데이트
        }));
    }, [userNick]);

    // 모달 열기
    const openModal = (content) => {
        setSelectedContent(content);
        setIsModalOpen(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedContent('');
    };

    //qnaList userNick이 관리자일때만 가져오기
    useEffect(() => {
        const adminQnaList = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/qna`);
                setQnaList(response.data); // 받아온 데이터를 qnaList에 저장
            } catch (error) {
                console.log(error.response?.data || '데이터 가져오기 실패');
            }
        };

        if (userNick === "관리자") {
            adminQnaList();
        }

    }, [userNick])

    //문의하기 요청 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('ACCESS_TOKEN');
        try {
            const response = await axios.post(`${API_BASE_URL}/qna`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`, // 인증 토큰 추가
                },
            });
            alert('문의하기가 완료되었습니다.');
            setFormData({
                userNick: userNick,
                qnaTitle: '',
                qnaDtail: '',
            })
            navigate('/');
        } catch (error) {
            alert('문의하기 실패');
        }
    }



    return (
        <div className="qnaMainContainer">
            <span className="qnaHeaderTitle">QnA</span>
            {/* 관리자일 경우 입력 폼을 숨김 */}
            {userNick !== "관리자" && (
                <form onSubmit={handleSubmit} className="qnaInputForm">
                    {/* 닉네임 */}
                    <input
                        type="text"
                        name="userNick"
<<<<<<< HEAD
                        className="qnaTextInput"
=======
                        placeholder="이름을 입력해주세요"
                        className="qnaInput"
>>>>>>> parent of 41e2fb0 (add)
                        value={userNick || ""}
                        readOnly
                    />
    
                    {/* 제목 */}
                    <input
                        type="text"
                        name="qnaTitle"
<<<<<<< HEAD
                        placeholder="제목을 입력해주세요."
                        className="qnaTextInput"
=======
                        placeholder="제목을 입력해주세요"
                        className="qnaInput"
>>>>>>> parent of 41e2fb0 (add)
                        value={formData.qnaTitle}
                        onChange={handleChange}
                        required
                    />
    
                    {/* 내용 */}
                    <textarea
                        name="qnaDtail"
<<<<<<< HEAD
                        placeholder="내용을 입력해주세요."
                        className="qnaTextarea"
=======
                        placeholder="내용을 입력해주세요"
                        className="qnaInputtext"
>>>>>>> parent of 41e2fb0 (add)
                        value={formData.qnaDtail}
                        onChange={handleChange}
                        required
                    />
<<<<<<< HEAD
                    <div className="qnaEmailInfo">
                        <p>답변은 회원가입 당시 <br />이메일로 순차적 발송됩니다.</p>
=======
                    <div className="qnaEmailNotification">
                        답변은 회원가입 당시 이메일로 순차적으로 발송됩니다.
>>>>>>> parent of 41e2fb0 (add)
                    </div>
                    {/* 제출 버튼 */}
                    <button type="submit" className="qnaSubmitButton">
                        보내기
                    </button>
                </form>
            )}
    
            {/* QnA 게시판: 관리자만 볼 수 있음 */}
            {userNick === "관리자" && (
                <div className="qnaAdminBoard">
                    <table>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>내용</th>
                                <th>작성일자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {qnaList.map((qna, index) => (
                                <tr key={index}>
                                    <td data-label="번호">{qna.qnaNum || index + 1}</td>
                                    <td data-label="제목">{qna.qnaTitle}</td>
                                    <td data-label="작성자">{qna.userNick}</td>
                                    <td data-label="내용">
                                        <span
                                            onClick={() => openModal(qna.qnaDtail)} // 클릭 시 모달 열기
                                            style={{
                                                color: 'blue',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {qna.qnaDtail.length > 20
                                                ? `${qna.qnaDtail.substring(0, 20)}...`
                                                : qna.qnaDtail}
                                        </span>
                                    </td>
                                    <td data-label="작성일자">
                                        {qna.writeDate
                                            ? new Date(qna.writeDate).toLocaleString("ko-KR", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                            })
                                            : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* 모달 창 */}
            {isModalOpen && (
                <div className="qnaModalBackground" onClick={closeModal}>
                    <div className="qnaModalBox" onClick={(e) => e.stopPropagation()}>
                        <h2>내용 상세</h2>
                        <p>{selectedContent}</p>
                        <button onClick={closeModal} className="qnaModalCloseButton">
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
    
};

export default Qna;
