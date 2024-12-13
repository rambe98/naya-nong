import React, { useState } from "react";
import { useRecoilState } from "recoil";
import {
  startDateStateAtom,
  endDateStateAtom,
  priceRequestDTOAtom,
} from "../../recoil/FarmRecoil";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import FarmData from "../../assets/FarmData.json"; // FarmData.json import
import axios from "axios";

const FarmInfo = () => {
  const [startDate, setStartDate] = useRecoilState(startDateStateAtom); // 시작 날짜 리코일 상태
  const [endDate, setEndDate] = useRecoilState(endDateStateAtom); // 종료 날짜 리코일 상태
  const [priceRequestDTO, setPriceRequestDTO] = useRecoilState(priceRequestDTOAtom); // 전체 요청 데이터
  const [selectedProduct, setSelectedProduct] = useState(""); // 선택된 품목 상태
  const [selectedKind, setSelectedKind] = useState(""); // 선택된 품종 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [priceType, setPriceType] = useState("retail"); // 검색 유형

  // 분류 데이터
  const categories = [
    { code: "100", name: "식량작물" },
    { code: "200", name: "채소류" },
    { code: "300", name: "특용작물" },
    { code: "400", name: "과일류" },
  ];

  // 지역 데이터
  const regions = [
    { code: "1101", name: "서울" },
    { code: "2300", name: "인천" },
  ];

  // 품목 데이터 추출
  const products = Object.keys(FarmData).filter((key) => {
    return FarmData[key]?.some(
      (item) => item.p_itemcategorycode === priceRequestDTO.p_itemcategorycode
    );
  });

  // 품종 데이터 추출
  const kinds = selectedProduct
    ? FarmData[selectedProduct]?.map((item) => ({ kindcode: item.p_kindcode, kindname: item.kindname })) || []
    : [];

  // 검색 실행
  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    const apiUrl =
      priceType === "retail"
        ? "http://localhost:7070/retail/price/all"
        : "http://localhost:7070/wholeSale/price/all";

    const requestData = {
      ...priceRequestDTO,
      p_startday: startDate,
      p_endday: endDate,
    };

    try {
      const response = await axios.post(apiUrl, requestData);
      console.log("검색 결과:", response.data);
    } catch (err) {
      console.error("요청 실패:", err);
      setError("데이터 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 분류 변경 핸들러
  const handleCategoryChange = (e) => {
    setPriceRequestDTO((prev) => ({
      ...prev,
      p_itemcategorycode: e.target.value,
    }));
  };

  // 지역 변경 핸들러
  const handleRegionChange = (e) => {
    setPriceRequestDTO((prev) => ({
      ...prev,
      p_countrycode: e.target.value,
    }));
  };

  // 품목 변경 핸들러
  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
    setPriceRequestDTO((prev) => ({
      ...prev,
      p_itemcode: FarmData[e.target.value]?.[0]?.p_itemcode || "",
    }));
  };

  // 품종 변경 핸들러
  const handleKindChange = (e) => {
    setSelectedKind(e.target.value);
    setPriceRequestDTO((prev) => ({
      ...prev,
      p_kindcode: e.target.value,
    }));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>소매가격 도매가격 정보 검색</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* 날짜 선택 */}
        <div>
          <label>기간:</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <DatePicker
              selected={new Date(startDate)}
              onChange={(date) => setStartDate(date.toISOString().split("T")[0])}
              dateFormat="yyyy.MM.dd"
            />
            <span>~</span>
            <DatePicker
              selected={new Date(endDate)}
              onChange={(date) => setEndDate(date.toISOString().split("T")[0])}
              dateFormat="yyyy.MM.dd"
            />
          </div>
        </div>

        {/* 분류 */}
        <div>
          <label>분류:</label>
          <select onChange={handleCategoryChange}>
            <option value="">전체</option>
            {categories.map((category) => (
              <option key={category.code} value={category.code}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 품목 */}
        <div>
          <label>품목:</label>
          <select onChange={handleProductChange}>
            <option value="">전체</option>
            {products.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>

        {/* 품종 */}
        <div>
          <label>품종:</label>
          <select onChange={handleKindChange}>
            <option value="">전체</option>
            {kinds.map((kind, index) => (
              <option key={index} value={kind.kindcode}>
                {kind.kindname}
              </option>
            ))}
          </select>
        </div>

        {/* 지역 */}
        <div>
          <label>지역:</label>
          <select onChange={handleRegionChange}>
            <option value="">전체</option>
            {regions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {/* 검색 버튼 */}
        <div style={{ display: "flex", gap: "20px" }}>
          <button onClick={() => setPriceType("retail") || handleSearch()}>
            소매가로 검색
          </button>
          <button onClick={() => setPriceType("wholeSale") || handleSearch()}>
            도매가로 검색
          </button>
        </div>

        {/* 로딩 상태 및 에러 메시지 */}
        {loading && <p>로딩 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default FarmInfo;
