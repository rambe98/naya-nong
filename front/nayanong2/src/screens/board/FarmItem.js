import React, { useEffect, useState } from "react";
import "../../css/FarmItem.css";
import carrotImage from '../../assets/carrot.png';
import cabbageImage from '../../assets/cabbage.png';
import sweetpotatoImage from '../../assets/sweetpotato.png';
import strawberryImage from '../../assets/strawberry.png';
import axios from "axios";
import farmData from '../../assets/FarmData.json';
import { useRecoilState } from "recoil";
import { startDateStateAtom, endDateStateAtom } from "../../recoil/FarmRecoil";

// 날짜에서 하루 전 날짜 구하기
// p_startday의 날짜를 -1일 하는 함수
const getPreviousDay = (startDateState) => {
    const date = new Date(startDateState);  // 문자열을 Date 객체로 변환
    date.setDate(date.getDate() - 1);  // 날짜에서 1일 빼기
    return date.toISOString().split('T')[0];  // 'YYYY-MM-DD' 형식으로 반환  
};

const FarmItem = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [priceData, setPriceData] = useState([]); // 가격 데이터
    const [countryCode, setCountryCode] = useState("");
    const [currentItemIndex, setCurrentItemIndex] = useState(0);  // 현재 품목을 추적
    const [averagePrice, setAveragePrice] = useState(0); // 평균 가격
    const items = ["당근", "배추", "고구마", "딸기"];  // 품목 목록

    const [startDateState, setStartDateState] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 1); // 어제 날짜
        return date.toISOString().split('T')[0];  // 'YYYY-MM-DD' 형식으로 반환
    });

    const [endDateState, setEndDateState] = useState(() => {
        const date = new Date();
        return date.toISOString().split('T')[0];  // 오늘 날짜
    });

    // 품목별 이미지 매핑
    const itemImages = {
        당근: carrotImage,
        배추: cabbageImage,
        고구마: sweetpotatoImage,
        딸기: strawberryImage
    };

    // 초기 렌더링 시 첫 번째 품목 정보 가져오기
    useEffect(() => {
        handleNext(); // 첫 번째 품목 데이터 조회
    }, []);

    // 품목에 대한 데이터 조회 함수
    const handleNext = async () => {
        const currentItem = items[currentItemIndex];
        const matchedItems = farmData[currentItem]; // farmData에서 현재 품목의 데이터를 찾음

        if (matchedItems && matchedItems.length > 0) {
            const updatedRequests = matchedItems.map((item) => ({
                p_itemcategorycode: item.p_itemcategorycode,
                p_itemcode: item.p_itemcode,
                p_kindcode: item.p_kindcode,
                p_countrycode: countryCode,
                p_startday: startDateState,
                p_endday: endDateState,
            }));

            await getAllPrice(updatedRequests); // 가격 조회 함수 호출
        } else {
            setError("해당 품목을 찾을 수 없습니다.");
        }

        // "다음" 버튼 클릭 시 품목 인덱스 변경
        setCurrentItemIndex((prevIndex) => (prevIndex + 1) % items.length);
    };

    // 가격 조회 함수
    const getAllPrice = async (farmItemRequests) => {
        setLoading(true);
        setError(null);

        const apiUrl = "http://localhost:7070/retail/price"; // 소매 가격 조회 API URL

        try {
            console.log("요청 데이터 : ", farmItemRequests);

            // 가격 요청
            const promises = farmItemRequests.map((request) =>
                axios.post(apiUrl, request)
            );

            const responses = await Promise.all(promises);

            let farmItemData = responses.flatMap((response) => {

                //응답데이터가 배열인지 확인
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
                    // 만약 response.data가 배열이 아니라면 오류 처리
                    setError("서버에서 데이터를 잘못 반환했습니다.");
                    return [];
                }
            });

            console.log("응답답 데이터 : ", farmItemData);

            // countyname이 "평균"인 데이터만 필터링
            farmItemData = farmItemData.filter((item) => item.countyname === "평균");

            if (farmItemData.length === 0) {
                const newStartDateState = getPreviousDay(startDateState);
                setStartDateState(newStartDateState);
                return;
            }

            //평균 가격 계산
            const totalPrice = farmItemData.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
            const average = totalPrice / (farmItemData.length || 1);
            setAveragePrice(average);  // 평균 가격 상태 업데이트

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

    return (
        <div className="farmItemContainer">
            <h1>{items[currentItemIndex]}</h1>
            <img src={itemImages[items[currentItemIndex]]} alt={items[currentItemIndex]} className="farmItem" />
            <button onClick={handleNext}>다음</button>
            {loading && <p>데이터를 가져오는 중...</p>}
            {error && <p>{error}</p>}

            {priceData.length > 0 && (
                <div>
                    <h2>가격 정보</h2>
                    {priceData.map((data, index) => (
                        <div key={index}>
                            <p>기준 날짜: {data.date}</p>
                            <p>평균 가격: {averagePrice}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FarmItem;
