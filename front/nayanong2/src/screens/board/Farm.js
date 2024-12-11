import React, { useState, useEffect } from "react";
import "../../css/Farm.css";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const Farm = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [priceData, setPriceData] = useState([]);
    const [error, setError] = useState("");

    // 요청 데이터 예시
    const requestData = 
    {
        "p_startday": "2024-12-08",
        "p_endday": "2024-12-09",
        "p_itemcategorycode": "200",
        "p_itemcode": "258",
        "p_kindcode": "01",
        "p_productrankcode": "04",
        "p_countrycode": "2300",
        "p_returntype": "json"
    }
       

    const fetchdata = async () => {
        try {
            const response = await axios.post(
                `http://localhost:7070/api/price`,
                requestData
            );
            if (response.status === 200) {
                setPriceData(response.data); // 데이터를 상태에 저장
            } else {
                setError("데이터를 가져오는 데 실패했습니다.");
            }
        } catch (error) {
            console.error("데이터를 가져오는 중 오류 발생:", error);
            setError("서버 요청 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        fetchdata(); // 컴포넌트 마운트 시 데이터 가져오기
    }, []);

    const handleToggle = (index) => {
        if (activeIndex === index) {
            setActiveIndex(null); // 이미 열려있으면 접기
        } else {
            setActiveIndex(index); // 열려있지 않으면 열기
        }
    };

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
            <div>
                {error && <p className="errorText">{error}</p>}
                {priceData.length > 0 ? (
                    priceData.map((item, index) => (
                        <div key={index}>
                            <p>평균</p>
                            <p>연도 : {item.yyyy}</p>
                            <p>날짜 : {item.regday}</p>
                            <p>가격: {item.price}</p>
                        </div>
                    ))
                ) : (
                    <p>데이터가 없습니다.</p>
                )}
            </div>
            <div>
                <div className="farmItem" onClick={() => handleToggle(0)}>
                    <h3>1. 항목 제목</h3>
                    {activeIndex === 0 && (
                        <p className="farmItemDetails">항목 1에 대한 추가 정보입니다.</p>
                    )}
                </div>
                <div className="farmItem" onClick={() => handleToggle(1)}>
                    <h3>2. 항목 제목</h3>
                    {activeIndex === 1 && (
                        <p className="farmItemDetails">항목 2에 대한 추가 정보입니다.</p>
                    )}
                </div>
                <div className="farmItem" onClick={() => handleToggle(2)}>
                    <h3>3. 항목 제목</h3>
                    {activeIndex === 2 && (
                        <p className="farmItemDetails">항목 3에 대한 추가 정보입니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Farm;
