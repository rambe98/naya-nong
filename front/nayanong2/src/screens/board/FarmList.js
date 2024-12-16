import React, { useState, useEffect } from "react";
import "../../css/FarmList.css";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { priceRequestDTOAtom, farmDataAtom, selectedItemAtom, priceDataAtom, startDateStateAtom, endDateStateAtom } from "../../recoil/FarmRecoil";

// p_startday의 날짜를 -1일 하는 함수
const getPreviousDay = (startDateState) => {
    const date = new Date(startDateState);  // 문자열을 Date 객체로 변환
    date.setDate(date.getDate() - 1);  // 날짜에서 1일 빼기
    return date.toISOString().split('T')[0];  // 'YYYY-MM-DD' 형식으로 반환  
};

const FarmList = () => {
    const [priceType, setPriceType] = useState(""); // 분류 상태
    const [searchTerm, setSearchTerm] = useState(""); // 입력된 검색어 상태
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [countryCode, setCountryCode] = useState("");
    const itemMappings = useRecoilValue(farmDataAtom);
    const [priceRequestDTO, setPriceRequestDTO] = useRecoilState(priceRequestDTOAtom);
    const [startDateState, setStartDateState] = useRecoilState(startDateStateAtom);
    const [endDateState, setEndDateState] = useRecoilState(endDateStateAtom);
    const setSelectedItemState = useSetRecoilState(selectedItemAtom);
    const setPriceDataState = useSetRecoilState(priceDataAtom);
    const priceData = useRecoilValue(priceDataAtom); // Recoil 상태에서 priceData 구독

    const [searchCompleted, setSearchCompleted] = useState(false); // 검색 완료 상태

    const handlePriceType = (e) => {
        const selectedType = e.target.value;
        const selectPriceType = selectedType === "도매" ? "retail" : selectedType === "소매" ? "wholeSale" : "";

        setPriceType(selectPriceType);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setError("검색어를 입력하세요.");
            return;
        }

        const matchedItems = itemMappings[searchTerm];
        if (matchedItems && matchedItems.length > 0) {
            const updatedRequests = matchedItems.map((item) => ({
                p_itemcategorycode: item.p_itemcategorycode,
                p_itemcode: item.p_itemcode,
                p_kindcode: item.p_kindcode,
                p_countrycode: countryCode,
                p_startday: startDateState,
                p_endday: endDateState,
            }));

            setPriceRequestDTO((prevState) => ({
                ...prevState,
                requests: updatedRequests,
            }));
            setSelectedItemState(searchTerm);
            setError(""); // 오류 메시지 초기화
            setSearchCompleted(true); // 검색 완료 상태 업데이트

            // 검색 후 getAllPrice 호출
            await getAllPrice(updatedRequests);
        } else {
            setError("해당 품목을 찾을 수 없습니다.");
            setSearchCompleted(false); // 검색 완료 상태 초기화
        }
    };

    // 조회
    const getAllPrice = async (updatedRequests) => {
        setLoading(true);
        setError(null);

        const apiUrl =
            priceType === "retail" ? "http://localhost:7070/retail/price/all"
                :
                priceType === "wholeSale" ? "http://localhost:7070/wholeSale/price/all"
                    : "http://localhost:7070/retail/price/all"

        try {
            console.log("데이터를 요청하는 중...", updatedRequests);  // 요청할 데이터가 제대로 전달되는지 확인

            // updatedRequests 배열을 바로 사용
            const promises = updatedRequests.map((request) =>
                axios.post(apiUrl, request)
            );
            // Promise.all()로 모든 요청이 끝날 때까지 기다림
            // responses는 모든 axios.post 요청의 응답들을 배열로 가지고 있음
            const responses = await Promise.all(promises);
            console.log("반환 데이터 :", responses);

            let transformedData = responses.flatMap((response) => {
                return response.data?.map((item) => {
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
                    };
                }).filter(item => item !== null);
            });

            console.log("요청 데이터 :", priceRequestDTO);
            console.log("최종 변환된 데이터:", transformedData);
            // 데이터가 없으면 시작일을 1일 빼서 다시 시도
            if (transformedData.length === 0) {
                const newStartDateState = getPreviousDay(startDateState);  // 1일 빼는 함수 사용
                setStartDateState(newStartDateState);  // 새로운 시작일로 설정
                return;  // 데이터를 받지 못하면 함수 종료
            }
            setPriceDataState(transformedData);
            setMessage("");

        } catch (error) {
            console.error("Error fetching data:", error);
            setPriceDataState([]);
            setError("서버 요청 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="farmListPage">  {/* 클래스 추가 */}
            <div className="farmContainer">
                <div className="farmListSearchContainer">
                    <select
                        className="farmListSelect"
                        onChange={handlePriceType}
                        value={priceType === "retail" ? "도매" : priceType === "wholeSale" ? "소매" : ""}
                    >
                        <option value="" disabled>
                            분류
                        </option>
                        <option value="도매">도매</option>
                        <option value="소매">소매</option>
                    </select>
                    <form className="farmListSearchForm" onSubmit={handleSearch}>
                        <input
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit">
                            <FaSearch />
                        </button>
                    </form>
                </div>
                <div className="farmListContainer">
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <div className="FarmListDetailContainer">
                        <div className="marketGroupedPrices">
                            <div className="farmListSearchResult">
                                {searchCompleted && searchTerm && (

                                    <h3>"{searchTerm}"으로 검색한 결과입니다.</h3>
                                )}
                            </div>
                            {/* priceData가 없을 때 */}
                            {priceData.length === 0 ? (
                                <div>검색어를 입력하세요.</div>
                            ) : (
                                <>
                                    {/* priceData가 있을 때 */}
                                    {Object.entries(priceData
                                        .filter(item => item.marketname !== "null")
                                        .reduce((acc, item) => {
                                            // marketname을 기준으로 그룹화
                                            if (!acc[item.marketname]) {
                                                acc[item.marketname] = [];  // acc는 누적된 객체, 없으면 새로운 배열 생성
                                            }
                                            acc[item.marketname].push(item);  // 해당 marketname에 item 추가
                                            return acc;  // 누적된 객체(acc)를 반환
                                        }, {}))
                                        .map(([marketName, marketGroup]) => {
                                            // 가장 최신 날짜 항목만 선택
                                            const latestItem = marketGroup.reduce((latest, current) => {
                                                const latestDate = new Date(latest.date);
                                                const currentDate = new Date(current.date);
                                                return currentDate > latestDate ? current : latest;
                                            });

                                            return (
                                                <div key={marketName} className="marketGroupedItem">
                                                    <h3>유통 업체 : {marketName}</h3>
                                                    <div>
                                                        <p>지역 : {latestItem.countyname}</p>
                                                        <p>제품 : {latestItem.itemname}</p>
                                                        <p>가격 : {latestItem.price}</p>
                                                        <p>단위 : {latestItem.kindname}</p>
                                                        <p>날짜 : {latestItem.date}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmList;
