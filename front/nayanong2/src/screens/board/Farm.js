import React, { useState } from "react";
import "../../css/Farm.css";
import { FaSearch } from "react-icons/fa";

const Farm = () => {
    const [activeIndex, setActiveIndex] = useState(null);

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
                <div className="farmItem" onClick={() => handleToggle(0)}>
                    <h3>1. 항목 제목</h3>
                    {activeIndex === 0 && <p className="farmItemDetails">항목 1에 대한 추가 정보입니다.</p>}
                </div>
                <div className="farmItem" onClick={() => handleToggle(1)}>
                    <h3>2. 항목 제목</h3>
                    {activeIndex === 1 && <p className="farmItemDetails">항목 2에 대한 추가 정보입니다.</p>}
                </div>
                <div className="farmItem" onClick={() => handleToggle(2)}>
                    <h3>3. 항목 제목</h3>
                    {activeIndex === 2 && <p className="farmItemDetails">항목 3에 대한 추가 정보입니다.</p>}
                </div>
                <div className="farmItem" onClick={() => handleToggle(2)}>
                    <h3>4. 항목 제목</h3>
                    {activeIndex === 3 && <p className="farmItemDetails">항목 4에 대한 추가 정보입니다.</p>}
                </div>
                <div className="farmItem" onClick={() => handleToggle(2)}>
                    <h3>5. 항목 제목</h3>
                    {activeIndex === 4 && <p className="farmItemDetails">항목 5에 대한 추가 정보입니다.</p>}
                </div>
            </div>
        </div>
    );
};

export default Farm;
