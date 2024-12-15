import React, { useState, useEffect } from "react";
import "../../css/FarmList.css"
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { priceRequestDTOAtom, farmDataAtom, selectedItemAtom, priceDataAtom, startDateStateAtom, endDateStateAtom } from "../../recoil/FarmRecoil";

const FarmList = () => {
    const [priceType, setPriceType] = useState(""); // 분류 상태
    const [searchTerm, setSearchTerm] = useState(""); // 입력된 검색어 상태
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [countryCode, setCountryCode] = useState("")
    const itemMappings = useRecoilValue(farmDataAtom);
    const [priceRequestDTO, setPriceRequestDTO] = useRecoilState(priceRequestDTOAtom);
    const [startDateState, setStartDateState] = useRecoilState(startDateStateAtom)
    const [endDateState, setEndDateState] = useRecoilState(endDateStateAtom)
    const setSelectedItemState = useSetRecoilState(selectedItemAtom);
    const setPriceDataState = useSetRecoilState(priceDataAtom);
    const priceData = useRecoilValue(priceDataAtom); // Recoil 상태에서 priceData 구독


    useEffect(() => {
        console.log("priceType 값이 변경되었습니다:", priceType);
    }, [priceType]);

    const handlePriceType = (e) => {
        const selectedType = e.target.value;
        const selectPriceType = selectedType === "도매" ? "retail" : selectedType === "소매" ? "wholeSale" : "";

        setPriceType(selectPriceType);
    };

    const handleSearch = (e) => {
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
        } else {
            setError("해당 품목을 찾을 수 없습니다.");
        }
    };

    useEffect(() => {
        if (priceRequestDTO.requests && priceRequestDTO.requests.length > 0) {
            getAllPrice();
        }
    }, [priceRequestDTO]);

    const getAllPrice = async () => {
        setLoading(true);
        setError(null);

        const apiUrl =
            priceType === "retail" ? "http://localhost:7070/retail/price/all"
                :
                priceType === "wholeSale" ? "http://localhost:7070/wholeSale/price/all"
                    : "http://localhost:7070/retail/price/all"

        try {
            const promises = priceRequestDTO.requests.map((request) =>
                axios.post(apiUrl, request)
            );

            const responses = await Promise.all(promises);
            const transformedData = responses.flatMap((response) =>
                response.data.map((item) => ({
                    date: `${item.yyyy}-${item.regday.split('/').join('-')}`,
                    price: parseFloat(item.price.replace(/,/g, "")) || 0,
                    countyname: item.countyname,
                    itemname: item.itemname,
                    marketname: item.marketname,
                    kindname: item.kindname
                }))
            );

            console.log("요청 데이터 :", priceRequestDTO);
            console.log("반환 데이터 :", responses);

            setPriceDataState(transformedData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setPriceDataState([]);
            setError("서버 요청 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="farmListContainer">
            <div className="farmListSearchContainer">
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
            <div className="farmListFilterContainer">
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
            </div>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <div className="FarmListDetailContainer">
                {/* <div>
                    {priceData.filter(item => item.itemname !== "null").slice(0, 1).map((item, index) => (
                        <div key={index}>
                            <p>제품명: {item.itemname}</p>
                            <p>단위: {item.kindname}</p>
                        </div>
                    ))}
                </div>

                <div className="averagePrice">
                    
                    {priceData.filter(item => item.countyname === "평균").map((item, index) => (
                        <div key={index}>
                            <p>평균가: {item.price}</p>
                        </div>
                    ))}
                 
                    {priceData.filter(item => item.countyname === "평년").map((item, index) => (
                        <div key={index}>
                            <p>평년가: {item.price}</p>
                        </div>
                    ))}
                </div> */}
                <div className="marketGroupedPrices">
                    {Object.entries(priceData.filter(item => item.marketname !== "null").reduce((acc, item) => {
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
                        })}
                </div>
            </div>

        </div>
    );
};


export default FarmList;
