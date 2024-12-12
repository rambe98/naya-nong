import React, { useState, useEffect } from "react";
import "../../css/Farm.css";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { priceRequestDTOAtom, countryCodeStateAtom, farmDataAtom } from "../../recoil/FarmRecoil";

const Farm = () => {
    const [priceType, setPriceType] = useState("retail");
    const [priceData, setPriceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState("");
    const itemMappings = useRecoilValue(farmDataAtom);
    const [priceRequestDTO, setPriceRequestDTO] = useRecoilState(priceRequestDTOAtom);
    const [countryCode, setCountryCode] = useRecoilState(countryCodeStateAtom);

    const getAllPrice = async () => {
        setLoading(true);
        setError("");

        console.log("요청 값:", priceRequestDTO);

        const apiUrl = priceType === "retail"
            ? "http://localhost:7070/retail/price/all"
            : "http://localhost:7070/wholeSale/price";

        try {
            const response = await axios.post(apiUrl, priceRequestDTO);

            console.log("반환 값:", response.data);

            if (response.status === 200) {
                setPriceData(response.data);
            } else {
                setError("데이터를 가져오는 데 실패했습니다.");
            }
        } catch (error) {
            setError("서버 요청 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (countryCode && priceRequestDTO.p_itemcode && priceRequestDTO.p_endday) {
            getAllPrice();
        }
    }, [countryCode, priceRequestDTO.p_itemcode, priceRequestDTO.p_endday]);

    const handleContryChange = (e) => {
        const selectCountry = e.target.value;
        let newCountryCode = selectCountry === "서울" ? "2100" : selectCountry === "인천" ? "2300" : "";
        setCountryCode(newCountryCode);

        // priceRequestDTO에 지역 코드 반영
        setPriceRequestDTO((prevState) => ({
            ...prevState,
            p_countrycode: newCountryCode
        }));
    };

   

    const handleSelectItem = (itemName) => {
        setSelectedItem(itemName);

        if (itemMappings[itemName] && itemMappings[itemName].length > 0) {
            const { p_itemcategorycode, p_itemcode, p_kindcode } = itemMappings[itemName][0];
            setPriceRequestDTO(prev => ({
                ...prev,
                p_itemcategorycode,
                p_itemcode,
                p_kindcode,
            }));
        }
    };

    return (
        <div className="farmContainer">
            <div className="farmSearchContainer">
                <form className="farmSearchForm">
                    <input placeholder="Search" />
                    <button type="button" onClick={getAllPrice}>
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
                <select  className="farmSelect" onChange={(e) => handleSelectItem(e.target.value)}>
                    <option value="">품목을 선택하세요</option>
                    {Object.keys(itemMappings).map((key) => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                </select>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className="FarmDetailContainer">
                <div>
                    {loading && <p>로딩 중...</p>}
                    {priceData.length > 0 ? (
                        priceData.map((item, index) => (
                            <div key={index}>
                                <p>가격: {item.price}</p>
                            </div>
                        ))
                    ) : (
                        <p>데이터가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Farm;
  