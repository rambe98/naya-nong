import React, { useState, useEffect } from "react";
import "../../css/Farm.css";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { priceRequestDTOAtom, countryCodeStateAtom, farmDataAtom, selectedItemAtom, priceDataAtom } from "../../recoil/FarmRecoil"

const FarmList = () => {
    const [priceType, setPriceType] = useState("retail");
    const setPriceDataState = useSetRecoilState(priceDataAtom);

    const [searchTerm, setSearchTerm] = useState(""); // 입력된 검색어 상태
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const itemMappings = useRecoilValue(farmDataAtom);
    const [priceRequestDTO, setPriceRequestDTO] = useRecoilState(priceRequestDTOAtom);
    const [countryCode, setCountryCode] = useRecoilState(countryCodeStateAtom);
    const setSelectedItemState = useSetRecoilState(selectedItemAtom);
    const priceData = useRecoilValue(priceDataAtom); // Recoil 상태에서 priceData 구독

    const handleContryChange = async (e) => {
        const selectCountry = e.target.value;
        const newCountryCode = selectCountry === "서울" ? "2100" : selectCountry === "인천" ? "2300" : "";

        setCountryCode(newCountryCode); // 지역 상태 업데이트

        // priceRequestDTO 상태 업데이트 후 getAllPrice 실행
        setPriceRequestDTO((prevState) => {
            const updatedRequest = {
                ...prevState,
                p_countrycode: newCountryCode,
            };
            // 업데이트 직후 데이터를 요청
            setTimeout(() => getAllPrice(updatedRequest), 0);
            return updatedRequest;
        });
    };

    const getAllPrice = async () => {
        // 지역과 품목이 설정되지 않았다면 요청하지 않음
        if (!priceRequestDTO.p_countrycode || !priceRequestDTO.p_itemcode) {
            console.log("지역 또는 품목이 설정되지 않아 요청을 중단합니다.");
            return;
        }

        setLoading(true);
        setError("");

        console.log("요청 값:", priceRequestDTO);

        const apiUrl = priceType === "retail"
            ? "http://localhost:7070/retail/price/all"
            : "http://localhost:7070/wholeSale/price";

        try {
            const response = await axios.post(apiUrl, priceRequestDTO);

            console.log("반환 값:", response.data);

            if (response.status === 200 && response.data.length > 0) {
                const transformedData = response.data.map(item => ({
                    date: `${item.yyyy}-${item.regday}`, // 날짜 변환
                    price: parseFloat(item.price.replace(/,/g, "")) || 0, // 문자열 가격을 숫자로 변환
                }));

                setPriceDataState(transformedData); // Recoil 상태에 데이터 저장
            } else {
                setPriceDataState([]);
                setError("데이터를 가져오는 데 실패했습니다.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setPriceDataState([]);
            setError("서버 요청 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setError("검색어를 입력하세요.");
            return;
        }

        const matchedItem = itemMappings[searchTerm]; // 입력된 값으로 데이터 조회
        if (matchedItem && matchedItem.length > 0) {
            const { p_itemcategorycode, p_itemcode, p_kindcode } = matchedItem[0];
            setPriceRequestDTO(prev => ({
                ...prev,
                p_itemcategorycode,
                p_itemcode,
                p_kindcode,
            }));
            setSelectedItemState(searchTerm); // 선택된 아이템 상태 업데이트
            getAllPrice(); // 검색 요청 실행
        } else {
            setError("해당 품목을 찾을 수 없습니다.");
        }
    };

    return (
        <div className="farmContainer">
            <div className="farmSearchContainer">
                <form className="farmSearchForm">
                    <input
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // 입력 상태 업데이트
                    />
                    <button type="button" onClick={handleSearch}>
                        <FaSearch />
                    </button>
                </form>
            </div>
            <div className="farmFilterContainer">
                <select
                    className="farmSelect"
                    onChange={handleContryChange}
                    value={countryCode === "2100" ? "서울" : countryCode === "2300" ? "인천" : ""}
                >
                    <option value="" disabled>지역</option>
                    <option value="서울">서울</option>
                    <option value="인천">인천</option>
                </select>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className="FarmDetailContainer">
                <div>
                    {loading && <p>로딩 중...</p>}
                    {priceData.length > 0 ? (
                        priceData.map((item, index) => {
                            console.log(item);  // item 객체 출력
                            return (
                                <div key={index}>
                                    <p>가격: {item.price}</p>
                                    <p>날짜 : {item.date}</p>
                                </div>
                            );
                        })
                    ) : (
                        <p>데이터가 없습니다.</p>
                    )}

                </div>
            </div>
        </div>
    );
};

export default FarmList;
