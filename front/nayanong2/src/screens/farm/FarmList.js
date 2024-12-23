import React, { useState, useRef, useEffect } from "react";
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
    const [searchCompleted, setSearchCompleted] = useState(false); // 검색 완료 상태
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [countryCode, setCountryCode] = useState("");
    const itemMappings = useRecoilValue(farmDataAtom);
    const [priceRequestDTO, setPriceRequestDTO] = useRecoilState(priceRequestDTOAtom);
    const setSelectedItemState = useSetRecoilState(selectedItemAtom);
    const setPriceDataState = useSetRecoilState(priceDataAtom);
    const priceData = useRecoilValue(priceDataAtom); // Recoil 상태에서 priceData 구독

    // 조회 시작 날짜
    const [startDateState, setStartDateState] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 1); // 어제 날짜
        return date.toISOString().split('T')[0];  // 'YYYY-MM-DD' 형식으로 반환
    });

    // 조회 종료 날짜
    const [endDateState, setEndDateState] = useState(() => {
        const date = new Date();
        return date.toISOString().split('T')[0];  // 오늘 날짜
    });

    // 검색창을 위한 ref
    const searchInputRef = useRef(null);

    const retryCount = useRef(0);

    const handlePriceType = (e) => {
        const selectedType = e.target.value;
        const selectPriceType = selectedType === "소매" ? "retail" : selectedType === "도매" ? "wholeSale" : "";

        setPriceType(selectPriceType);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            alert("검색어를 입력하세요.")
            setPriceDataState([])
            return;
        }

        if (searchInputRef.current) {
            searchInputRef.current.blur(); // 검색 후 포커스 해제
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

            // 첫 번째 검색 시 getAllPrice 바로 호출
            getAllPrice();
        } else {
            setError("해당 품목을 찾을 수 없습니다.");
            setSearchCompleted(false); // 검색 완료 상태 초기화
        }
    };

    const getAllPrice = async () => {
        setLoading(true);
        setError(null);
    
        // URL 선택
        const apiUrl =
            priceType === "retail" ? "http://localhost:7070/retail/price/all"
                : priceType === "wholeSale" ? "http://localhost:7070/wholeSale/price/all"
                    : "http://localhost:7070/retail/price/all";
    
        try {
            console.log("요청할 데이터:", priceRequestDTO.requests);
            const promises = priceRequestDTO.requests.map((request) =>
                axios.post(apiUrl, request)
            );
    
            const responses = await Promise.all(promises);
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
                        p_endday: endDateState,
                    };
                }).filter(item => item !== null);
            });
            console.log("받은 데이터:", transformedData);
    
            if (transformedData.length === 0) {
                if (retryCount.current < 7) {
                    // 날짜를 -1일 하는 부분
                    const newStartDateState = getPreviousDay(startDateState);
                    console.log("새로운 시작 날짜:", newStartDateState);  // 로그로 확인
                    setStartDateState(newStartDateState);  // 상태 변경
    
                    retryCount.current += 1;
    
                    // 상태 변경 후 getAllPrice()가 호출되지 않도록 useEffect로 다루기
                    return; // 리턴하여 재귀를 방지
                } else {
                    setError("해당 품목을 찾을 수 없습니다.");
                    setPriceDataState([]);
                    return;
                }
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
    
    useEffect(() => {
        // startDateState가 변경될 때마다 getAllPrice 다시 실행
        if (priceRequestDTO.requests && priceRequestDTO.requests.length > 0) {
            console.log("startDateState 변경 후 데이터 요청 시작:", startDateState);
            getAllPrice();
        }
    }, [startDateState, priceRequestDTO]);

    const handleFocus = () => {
        setSearchCompleted(false);
    };

    return (
        <div className="farmListPage">
            <div className="farmContainer">
                <div className="farmListSearchContainer">
                    <select
                        className="farmListSelect"
                        onChange={handlePriceType}
                        value={priceType === "wholeSale" ? "도매" : priceType === "retail" ? "소매" : ""}
                    >
                        <option value="" disabled>
                            분류
                        </option>
                        <option value="도매">도매</option>
                        <option value="소매">소매</option>
                    </select>
                    <form className="farmListSearchForm" onSubmit={handleSearch}>
                        <input
                            ref={searchInputRef}
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={handleFocus}
                        />
                        <button type="submit">
                            <FaSearch />
                        </button>
                    </form>
                </div>
                <div className={`farmListContainer ${searchCompleted ? 'visible' : ''}`}>
                    <div className="FarmListDetailContainer">
                        <div className="marketGroupedPrices">
                            <div className="farmListSearchResult">
                                {searchCompleted && searchTerm && (
                                    <h3>"{searchTerm}"에 대한 통합검색 결과 입니다.</h3>
                                )}
                                {error && <div style={{ color: "red" }}>{error}</div>}
                            </div>
                            {priceData.length === 0 && !error ? (
                                <div>검색어를 입력하세요.</div>
                            ) : (
                                <>
                                    {Object.entries(priceData
                                        .filter(item => item.marketname !== "null" && !isNaN(item.price))
                                        .reduce((acc, item) => {
                                            if (!acc[item.marketname]) {
                                                acc[item.marketname] = [];
                                            }
                                            acc[item.marketname].push(item);
                                            return acc;
                                        }, {}))
                                        .map(([marketName, marketGroup]) => {
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
                                                        {/* Intl.NumberFormat() 숫자를 지역화된 형식으로 포멧 (천단위 구분 쉼표 사용) */}
                                                        <p>가격 : {new Intl.NumberFormat().format(latestItem.price)}원</p>
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
