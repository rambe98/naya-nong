import React, { useEffect, useState, } from 'react';
import logo from '../../assets/logo.png'
import '../../css/Qna.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { clientNumAtom, userNickAtom } from '../../recoil/UserRecoil';

const Qna = () => {
    const navigate = useNavigate('');
   
    // const [userNick,setUserNick] = useRecoilState(userNickAtom)
    const userNick = localStorage.getItem("userNick");
    
    const [formData, setFormData] = useState({ //폼데이터를 보내기위한 초기값,
        userNick : userNick,
        qnaTitle : '',
        qnaDtail:'',
    })
    const [date, setDate] = useState(''); //작성일자
    const clientNum = useRecoilValue(clientNumAtom) //로컬스토리지에 클라이언트넘을 변수에저장
    
    useEffect(() => {
        // body에 클래스 추가
        document.body.classList.add('no-scroll');
    
        // 언마운트 시 클래스 제거
        return () => {
          document.body.classList.remove('no-scroll');
        };
      }, []);

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
    },[clientNum, navigate])
    // []를 사용하는이유는 페이지가 최초 렌더링 될때 한번만실행해야하고
    // []가 없을경우에는 상태가 변할때마다 업데이트되기때문에 원하는 값이 안나올수있다.(중복된 타이머가 발생)
    
    //클라이언트넘에 아무런 값이없을때 로그인 이동페이지로 이동하게함 if/else는 확인,취소
    useEffect(() => {
        if (!clientNum) {
            const userConfirmed = window.confirm(
                '로그인을 해야 이용 가능한 서비스입니다. \n로그인 페이지로 이동하시겠습니까?'
            );
        if(userConfirmed){
            navigate('/login', { state: { from: '/qna' } });
        }else {
            navigate('/');
        }
        }
    }, []);

    //사용자가 입력한 값으로 폼데이터 업데이트
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    // //clientNum이 변경될때마다 서버에서 닉네임을 받아온다.
    // useEffect(() => {
    //     const fetchNickName = async () => {
    //         try {
    //             if (clientNum) { // clientNum이 존재하는 경우에만 실행
    //                 const response = await axios.get(`http://localhost:7070/users/${clientNum}`);
    //                 if (response.status === 200) {
    //                     setUserNick(response.data.userNick); // 서버에서 받은 닉네임
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('닉네임 조회 실패:', error);
    //         }
    //     };
    
    //     fetchNickName(); // useEffect 실행 시 닉네임 조회
    // }, [clientNum]);
    
    // userNick이 변경될 때 formData.userNick 동기화
    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            userNick: userNick || "", // userNick을 업데이트
        }));
    }, [userNick]);
    

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:7070/qna`,formData,{
                headers: {
                    "Content-Type": "application/json",
                  },
            });
           alert('문의하기가 완료되었습니다.');
           setFormData({
            userNick : userNick,
            qnaTitle : '',
            qnaDtail : '',
           })
           navigate('/');
        } catch (error) {
            alert('문의하기 실패');
        }
        console.log(formData);
        
    }

    return (

        <div className="qnaContainer">
        <span className="QnaHeader">QnA</span>
        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className='qnaForm'>

            {/* 닉네임 */}
            <input
              type="text"
              name="userNick"
              placeholder="이름을 입력해주세요"
              className="qnaInput"
              value={userNick}
              readOnly // 읽기 전용
            />
      
            {/* 제목 */}
            <input
              type="text"
              name="qnaTitle"
              placeholder="제목을 입력해주세요"
              className="qnaInput"
              value={formData.qnaTitle}
              onChange={handleChange}
              required // 필수 입력
            />
      
            {/* 내용 */}
            <textarea
              name="qnaDtail"
              placeholder="내용을 입력해주세요"
              className="qnaInputtext"
              value={formData.qnaDtail}
              onChange={handleChange}
              required // 필수 입력
            />

          {/* 제출 버튼 */}
          <button type="submit" className="qnaButton">보내기</button>
        </form>
      </div>
      

    );
};

export default Qna;
