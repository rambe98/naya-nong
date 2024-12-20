import React, { useEffect, useState } from "react";
import "../../css/FarmItem.css";
import carrotImage from '../../assets/carrot.png';
import spinachImage from '../../assets/spinach.png';
import sweetpotatoImage from '../../assets/sweetpotato.png';
import broccoliImage from '../../assets/broccoli.png';
import bananaImage from '../../assets/banana.png';
import axios from "axios";
import farmData from '../../assets/FarmData.json';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, plugins } from 'chart.js';
import { Label } from "recharts";

// 날짜에서 하루 전 날짜 구하기
const getPreviousDay = (startDateState) => {
    const date = new Date(startDateState);  // 문자열을 Date 객체로 변환
    date.setDate(date.getDate() - 1);  // 날짜에서 1일 빼기
    return date.toISOString().split('T')[0];  // 'YYYY-MM-DD' 형식으로 반환  
};

// Chart.js 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const FarmItem = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [priceData, setPriceData] = useState([]); // 가격 데이터
    const [countryCode, setCountryCode] = useState("");
    const [currentItemIndex, setCurrentItemIndex] = useState(0);  // 현재 품목을 추적
    const items = ["시금치", "브로콜리", "당근", "바나나", "고구마"];  // 품목 목록

    const [startDateState, setStartDateState] = useState(() => {
        const date = new Date();
        // 조회 시작 날짜를 이틀 전으로 설정(아침에 거래 내역이 없어 조회가 안 되는 것을 방지)
        date.setDate(date.getDate() - 2);
        return date.toISOString().split('T')[0];  // 'YYYY-MM-DD' 형식으로 반환
    });

    const [endDateState, setEndDateState] = useState(() => {
        const date = new Date();
        return date.toISOString().split('T')[0];  // 오늘 날짜
    });

    // 품목별 이미지 매핑
    const itemImages = {
        시금치: spinachImage,
        브로콜리: broccoliImage,
        당근: carrotImage,
        바나나: bananaImage,
        고구마: sweetpotatoImage,
    };

    // 가격 조회 함수
    const getAllPrice = async (farmItemRequests) => {
        setLoading(true);
        setError(null);

        const apiUrl = "http://localhost:7070/retail/price"; // 소매 가격 조회 API URL

        try {
            console.log("요청데이터:", farmItemRequests);

            // 가격 요청
            const promises = farmItemRequests.map((request) =>
                axios.post(apiUrl, request)
            );

            const responses = await Promise.all(promises);

            let farmItemData = responses.flatMap((response) => {
                console.log("응답 데이터 : ", response.data);

                if (Array.isArray(response.data)) {
                    return response.data.map((item) => {
                        if (!item) return null;
                        let currentStartDay = item.p_startday || startDateState;
                        return {
                            date: item.yyyy && item.regday ? `${item.yyyy}-${item.regday.split('/').join('-')}` : "",
                            price: item.price ? parseFloat(item.price.replace(/,/g, "")) : 0,
                            countyname: item.countyname,
                            itemname: item.itemname,
                            marketname: item.marketname,
                            kindname: item.kindname,
                            p_startday: currentStartDay,
                            p_endday: endDateState,
                        };
                    }).filter(item => item !== null);
                } else {
                    setError("서버에서 데이터를 잘못 반환했습니다.");
                    return [];
                }
            });

            console.log("최종 변환된 데이터:", farmItemData);

            // countyname이 "평균"인 데이터만 필터링
            farmItemData = farmItemData.filter((item) => item.countyname === "평균");

            if (farmItemData.length === 0) {
                const newStartDateState = getPreviousDay(startDateState);
                setStartDateState(newStartDateState);
                return;
            }

            setPriceData(farmItemData); // 가격 데이터 상태 업데이트
            setError(null); // 에러 상태 초기화

        } catch (error) {
            console.error("Error fetching data:", error);
            setPriceData([]); // 가격 데이터 초기화
            setError("서버 요청 중 오류가 발생했습니다."); // 오류 메시지 설정
        } finally {
            setLoading(false); // 로딩 상태 종료
        }
    };

    // 처음 화면이 렌더링 될 때 한 번만 호출
    useEffect(() => {
        const initialItem = items[0]; // 첫 번째 품목 (당근)
        const matchedItems = farmData[initialItem];

        if (matchedItems && matchedItems.length > 0) {
            const updatedRequests = matchedItems.map((item) => ({
                p_itemcategorycode: item.p_itemcategorycode,
                p_itemcode: item.p_itemcode,
                p_kindcode: item.p_kindcode,
                p_countrycode: countryCode,
                p_startday: startDateState,
                p_endday: endDateState,
            }));

            getAllPrice(updatedRequests); // 첫 번째 품목에 대한 가격 데이터를 가져옵니다.
        }
    }, []); // 빈 배열을 넣어서 처음 렌더링 시에만 실행되도록 설정

    // 그래프 데이터
    const itemChart = {
        labels: priceData.map((item) => item.date), // 날짜
        datasets: [
            {
                label: "소매가 그래프",
                data: priceData.map((item) => item.price), // 가격
                fill: false,
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.1,
            },
        ],
    }
    //그래프 옵션
    const itemChartOption = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    boxWidth: 0, // 박스 숨기기
                    usePointStyle: true, // 점 스타일 사용
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "가격 (원)",
                },
            },
        },
    }


    // 다음 품목으로 넘어가는 함수
    const handleNext = async () => {
        const nextItemIndex = (currentItemIndex + 1) % items.length; // 다음 품목 인덱스
        setCurrentItemIndex(nextItemIndex);

        const nextItem = items[nextItemIndex]; // 해당 품목
        const matchedItems = farmData[nextItem];

        if (matchedItems && matchedItems.length > 0) {
            const updatedRequests = matchedItems.map((item) => ({
                p_itemcategorycode: item.p_itemcategorycode,
                p_itemcode: item.p_itemcode,
                p_kindcode: item.p_kindcode,
                p_countrycode: countryCode,
                p_startday: startDateState,
                p_endday: endDateState,
            }));

            getAllPrice(updatedRequests); // 가격 데이터를 가져옵니다.
        } else {
            setError("해당 품목을 찾을 수 없습니다.");
        }
    };

    // 이전 품목으로 넘어가는 함수
    const handlePrevious = async () => {
        const prevItemIndex = (currentItemIndex - 1 + items.length) % items.length; // 이전 품목 인덱스
        setCurrentItemIndex(prevItemIndex);

        const prevItem = items[prevItemIndex]; // 해당 품목
        const matchedItems = farmData[prevItem];

        if (matchedItems && matchedItems.length > 0) {
            const updatedRequests = matchedItems.map((item) => ({
                p_itemcategorycode: item.p_itemcategorycode,
                p_itemcode: item.p_itemcode,
                p_kindcode: item.p_kindcode,
                p_countrycode: countryCode,
                p_startday: startDateState,
                p_endday: endDateState,
            }));

            getAllPrice(updatedRequests); // 가격 데이터를 가져옵니다.
        } else {
            setError("해당 품목을 찾을 수 없습니다.");
        }
    };

    return (
        <div className="farmItemContainer">
            <h2>현대인에게 필요한 채소와 과일 Top 5</h2>
            <div className="farmItemImageContainer">
                <div className="farmImageContainer">
                    <img
                        src={itemImages[items[currentItemIndex]]}
                        alt={items[currentItemIndex]}
                        className="farmItem"
                    />
                    <h2>{items[currentItemIndex]}</h2>
                </div>
                <div>
                    {priceData.length > 1 && (
                        <div className="farmDateContainer">
                            <div className="itemDate0">
                                <p>기준 날짜 </p>
                                <h4>{priceData.slice(-2)[0].date}</h4>
                                <p>평균 소매가</p>
                                <h4>{priceData.slice(-2)[0].price}원</h4>
                            </div>
                            <div className="itemDate1">
                                <p>기준 날짜 </p>
                                <h4>{priceData.slice(-2)[1].date}</h4>
                                <p>평균 소매가</p>
                                <h4>{priceData.slice(-2)[1].price}원</h4>
                            </div>
                        </div>
                    )}
                </div>
                <div className="itemChartContainer">
                    {priceData.length > 0 && <Line data={itemChart} options={itemChartOption} />}
                </div>
            </div>
            <div className="buttonContainer">
                <button onClick={handlePrevious} className="previousButton">&lt;</button>
                <button onClick={handleNext} className="nextButton">&gt;</button>
            </div>
        </div>
    );

};

export default FarmItem;
