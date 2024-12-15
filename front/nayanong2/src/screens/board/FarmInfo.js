import React, { useState } from "react";
import { useRecoilState } from "recoil";
import {
  startDateStateAtom,
  endDateStateAtom,
  priceRequestDTOAtom,
} from "../../recoil/FarmRecoil";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import FarmData from "../../assets/FarmData.json";
import axios from "axios";
import "../../css/FarmInfo.css";
import Graph from "./Graph";

const FarmInfo = () => {
  const [startDate, setStartDate] = useRecoilState(startDateStateAtom);
  const [endDate, setEndDate] = useRecoilState(endDateStateAtom);
  const [priceRequestDTO, setPriceRequestDTO] = useRecoilState(priceRequestDTOAtom);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedKind, setSelectedKind] = useState("");
  const [searchResults, setSearchResults] = useState([]); // 검색 결과
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [priceType, setPriceType] = useState("retail");
  const [title, setTitle] = useState("평균 가격 결과"); // 제목 상태 추가

  const categories = [
    { code: "100", name: "식량작물" },
    { code: "200", name: "채소류" },
    { code: "300", name: "특용작물" },
    { code: "400", name: "과일류" },
  ];

  const regions = [
    { code: "1101", name: "서울" },
    { code: "2300", name: "인천" },
    { code: "3911", name: "제주" },
  ];

  const products = Object.keys(FarmData).filter((key) => {
    return FarmData[key]?.some(
      (item) => item.p_itemcategorycode === priceRequestDTO.p_itemcategorycode
    );
  });

  const kinds = selectedProduct
    ? FarmData[selectedProduct]?.map((item) => ({
        kindcode: item.p_kindcode,
        kindname: item.kindname,
      })) || []
    : [];

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
      const filteredResults = response.data.filter((item) => item.countyname === "평균");
      setSearchResults(filteredResults);

      // 제목 업데이트
      const regionName =
        regions.find((region) => region.code === priceRequestDTO.p_countrycode)?.name || "지역 없음";
      const productName = FarmData[selectedProduct]?.[0]?.itemname || selectedProduct || "품목 없음";
      const kindName =
        FarmData[selectedProduct]?.find((item) => item.p_kindcode === selectedKind)?.kindname ||
        selectedKind ||
        "품종 없음";

      setTitle(`${regionName} ${productName}의 ${kindName} 평균 가격`);
    } catch (err) {
      setError("데이터 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="farmInfo-container">
      <h2>소매 · 도매 날짜별 평균가격</h2>
      <div className="farmInfo-datePicker-container">
        <label>기간:</label>
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

      <div className="farmInfo-dropdown-container">
        <div>
          <label>분류:</label>
          <select onChange={(e) => setPriceRequestDTO({ ...priceRequestDTO, p_itemcategorycode: e.target.value })}>
            <option value="">전체</option>
            {categories.map((category) => (
              <option key={category.code} value={category.code}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>품목:</label>
          <select onChange={(e) => setSelectedProduct(e.target.value)}>
            <option value="">전체</option>
            {products.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>품종:</label>
          <select onChange={(e) => setSelectedKind(e.target.value)}>
            <option value="">전체</option>
            {kinds.map((kind) => (
              <option key={kind.kindcode} value={kind.kindcode}>
                {kind.kindname}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>지역:</label>
          <select onChange={(e) => setPriceRequestDTO({ ...priceRequestDTO, p_countrycode: e.target.value })}>
            <option value="">전체</option>
            {regions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="farmInfo-button-container">
        <button onClick={() => setPriceType("retail") || handleSearch()}>소매가로 검색</button>
        <button onClick={() => setPriceType("wholeSale") || handleSearch()}>도매가로 검색</button>
      </div>

      <div className="farmInfo-result-container">
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <h3>{title}</h3>
            <ul>
              {searchResults.map((item, index) => (
                <li key={index}>
                  날짜: {item.regday}, 평균 가격: {item.price}원
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Graph 컴포넌트에 searchResults를 props로 전달 */}
      <Graph searchResults={searchResults} />
    </div>
  );
};

export default FarmInfo;
