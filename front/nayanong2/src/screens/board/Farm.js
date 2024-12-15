import React, { useState, useEffect } from "react";
import "../../css/Farm.css";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { priceRequestDTOAtom, countryCodeStateAtom, farmDataAtom, selectedItemAtom, priceDataAtom } from "../../recoil/FarmRecoil";
import Graph from "./Graph";

const Farm = () => {
    const [priceType, setPriceType] = useState("retail");
    const [searchTerm, setSearchTerm] = useState(""); // 입력된 검색어 상태
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const itemMappings = useRecoilValue(farmDataAtom);
    const [priceRequestDTO, setPriceRequestDTO] = useRecoilState(priceRequestDTOAtom);
    const [countryCode, setCountryCode] = useRecoilState(countryCodeStateAtom);
    const setSelectedItemState = useSetRecoilState(selectedItemAtom);
    const setPriceDataState = useSetRecoilState(priceDataAtom);
    const priceData = useRecoilValue(priceDataAtom); // Recoil 상태에서 priceData 구독

    // 지역 변경 핸들러
    const handleContryChange = (e) => {
        const selectedCountry = e.target.value;
        const newCountryCode = selectedCountry === "서울" ? "1101" : selectedCountry === "인천" ? "2300" : "";

        setCountryCode(newCountryCode); // 지역 상태 업데이트
        setPriceRequestDTO((prevState) => ({
            ...prevState,
            p_countrycode: newCountryCode,
        }));
    };

    // 검색 핸들러
    const handleSearch = (e) => {
        e.preventDefault(); // 기본 이벤트 취소
        if (!searchTerm.trim()) {
            setError("검색어를 입력하세요.");
            return;
        }

        const matchedItems = itemMappings[searchTerm]; // 검색어로 매칭된 모든 데이터
        if (matchedItems && matchedItems.length > 0) {
            const updatedRequests = matchedItems.map((item) => ({
                p_itemcategorycode: item.p_itemcategorycode,
                p_itemcode: item.p_itemcode,
                p_kindcode: item.p_kindcode,
                p_countrycode: countryCode, // 지역 값 추가
            }));

            // 여러 요청 데이터를 저장
            setPriceRequestDTO((prevState) => ({
                ...prevState,
                requests: updatedRequests,
            }));
            setSelectedItemState(searchTerm);
        } else {
            setError("해당 품목을 찾을 수 없습니다.");
        }
    };

    // 상태 변경 후 요청 실행
    useEffect(() => {
        if (priceRequestDTO.requests && priceRequestDTO.requests.length > 0) {
            getAllPrice();
        }
    }, [priceRequestDTO]);

    // API 호출 함수
    const getAllPrice = async () => {
        setLoading(true);
        setError(null);

        const apiUrl =
            priceType === "retail"
                ? "http://localhost:7070/retail/price/all"
                : "http://localhost:7070/wholeSale/price";

        try {
            const promises = priceRequestDTO.requests.map((request) =>
                axios.post(apiUrl, request)
            );

            const responses = await Promise.all(promises);

            const transformedData = responses.flatMap((response) =>
                response.data.map((item) => ({
                    date: `${item.yyyy}-${item.regday}`,
                    price: parseFloat(item.price.replace(/,/g, "")) || 0,
                }))
            );
            console.log(responses);
            console.log("요청 데이터 (priceRequestDTO):", priceRequestDTO);

            
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
        <div className="farmContainer">
            <div className="farmSearchContainer">
                <form className="farmSearchForm" onSubmit={handleSearch}>
                    <input
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // 입력 상태 업데이트
                    />
                    <button type="submit">
                        <FaSearch />
                    </button>
                </form>
            </div>
            <div className="farmFilterContainer">
                <select
                    className="farmSelect"
                    onChange={handleContryChange}
                    value={countryCode === "1101" ? "서울" : countryCode === "2300" ? "인천" : ""}
                >
                    <option value="" disabled>
                        지역
                    </option>
                    <option value="서울">서울</option>
                    <option value="인천">인천</option>
                </select>
            </div>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <div className="FarmDetailContainer">
                <div>
                    {loading && <p>로딩 중...</p>}
                    {priceData.length > 0 ? (
                        priceData.map((item, index) => (
                            <div key={index}>
                                <p>가격: {item.price}</p>
                                <p>날짜: {item.date}</p>
                            </div>
                        ))
                    ) : (
                        <p>데이터가 없습니다.</p>
                    )}
                </div>
            </div>
            <Graph />
        </div>
    );
};

export default Farm;
