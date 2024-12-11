import React, { useState, useEffect } from "react";
import "../../css/Farm.css";
import { FaSearch } from "react-icons/fa";
import axios from "axios"; // axios import 추가

const Farm = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [priceData, setPriceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [countryCode, setCountryCode] = useState("");

    // 요청 데이터
    const priceRequestDTO = {
        p_startday: "2024-12-01",
        p_endday: "2024-12-09",
        p_itemcategorycode: "200",
        p_itemcode: "112",
        p_kindcode: "01",
        p_productrankcode: "",
        p_countrycode: contryCode,
        p_returntype: "json"
    };

    // 가격 데이터 요청 함수
    const getAllPrice = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:7070/api/price/all', priceRequestDTO, {
                headers: {
                    'Content-Type': 'application/json', // JSON 형식으로 데이터 전송
                }
            });
            console.log("api응답",response.data);
            
            setPriceData(response.data); // axios의 응답 데이터를 상태에 저장
        } catch (err) {
            console.error("api응답 error",error.message);
            setError(err.message); 
        } finally {
            setLoading(false); 
        }
    };

    // 컴포넌트가 처음 마운트될 때 가격 데이터 요청
    useEffect(() => {
        getAllPrice();
    }, []); // 빈 배열을 넣어 컴포넌트가 마운트될 때만 호출

    // 토글 기능
    const handleToggle = (index) => {
        if (activeIndex === index) {
            setActiveIndex(null); // 이미 열려있으면 접기
        } else {
            setActiveIndex(index); // 열려있지 않으면 열기
        }
    };

    // 가격 데이터 요청 버튼 클릭 시 호출
    const handlePriceRequest = () => {
        getAllPrice();
    };

    //지역 선택
    const handleContryChange =(e)=>{
        const selectContry = e.target.value
        if(selectContry === "서울"){
            setCountryCode("2100")
        }else if(selectContry === "인천"){
            setCountryCode("2300")
        }
    }

    return (
        <div className="farmContainer">
            <div className="farmTitle">도 • 소매가 정보</div>
            <div className="farmSearchContainer">
                <form className="farmSearchForm">
                    <input placeholder="Search" />
                    <button>
                        <FaSearch />
                    </button>
                </form>
            </div>
            <div className="farmFilterContainer">
                <select className="farmSelect">
                    <option>지역</option>
                    <option>서울</option>
                    <option>인천</option>
                </select>
                <select className="farmSelect">
                    <option>기간</option>
                    <option>일간</option>
                    <option>월간</option>
                    <option>연간</option>
                </select>
                <select className="farmSelect">
                    <option>분류</option>
                    <option>도매가격</option>
                    <option>소매가격</option>
                </select>
            </div>
            <button onClick={handlePriceRequest}>가격 데이터 요청</button>
            {error && <div style={{ color: 'red' }}>{error}</div>} 

            <div>
                {loading && <div>Loading...</div>} 

                {priceData.length > 0 ? (
                    priceData.map((item, index) => (
                        <div key={index} className="farmItem" onClick={() => handleToggle(index)}>
                            <h3>{item.name || `항목 ${index + 1}`}</h3>
                            <p>{item.kindname || '미제공'}</p>
                            <p>{item.countyname || '미제공'}</p>
                            <p>{item.marketname || '미제공'}</p>
                            <p>{item.yyyy || '미제공'}</p>
                            {activeIndex === index && (
                                <p className="farmItemDetails">{item.details || '항목에 대한 추가 정보입니다.'}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <div>가격 데이터를 아직 받아오지 않았습니다.</div>
                )}
            </div>
        </div>
    );
};

export default Farm;
