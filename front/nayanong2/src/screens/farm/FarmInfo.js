import React, { useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  startDateStateAtom,
  endDateStateAtom,
  priceRequestDTOAtom,
  searchResultsAtom,
  titleAtom,
  averagePriceAtom,
} from "../../recoil/FarmRecoil";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import FarmData from "../../assets/FarmData.json";
import axios from "axios";
import "../../css/FarmInfo.css";
import Graph from "./Graph";
import { ko } from "date-fns/locale";
import { API_BASE_URL } from '../../service/api-config';

const FarmInfo = () => {
  const [startDate, setStartDate] = useRecoilState(startDateStateAtom);
  const [endDate, setEndDate] = useRecoilState(endDateStateAtom);
  const [priceRequestDTO, setPriceRequestDTO] = useRecoilState(priceRequestDTOAtom);
  const [searchResults, setSearchResults] = useRecoilState(searchResultsAtom || []);
  const [title, setTitle] = useRecoilState(titleAtom);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedKind, setSelectedKind] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [priceType, setPriceType] = useState("retail");
  const setAveragePrice = useSetRecoilState(averagePriceAtom);

  const categories = [
    { code: "100", name: "식량작물" },
    { code: "200", name: "채소류" },
    { code: "300", name: "특용작물" },
    { code: "400", name: "과일류" },
  ];

  const regions = [
    { code: "1101", name: "서울" },
    { code: "2100", name: "부산" },
    { code: "2200", name: "대구" },
    { code: "2300", name: "인천" },
    { code: "2401", name: "광주" },
    { code: "2501", name: "대전" },
    { code: "2601", name: "울산" },
    { code: "3111", name: "수원" },
    { code: "3214", name: "강릉" },
    { code: "3211", name: "춘천" },
    { code: "3311", name: "청주" },
    { code: "3511", name: "전주" },
    { code: "3711", name: "포항" },
    { code: "3911", name: "제주" },
    { code: "3613", name: "순천" },
    { code: "3714", name: "안동" },
    { code: "3814", name: "창원" },
    { code: "3145", name: "용인" },
    { code: "2701", name: "세종" },
    { code: "3112", name: "성남" },
    { code: "3138", name: "고양" },
    { code: "3411", name: "천안" },
    { code: "3818", name: "김해" },
  ];

  // priceType 상태가 변경될 때마다 handleSearch 실행
  useEffect(() => {
    // priceType 변경 시 검색 실행 대신 로그만 출력
    console.log("priceType이 변경되었습니다:", priceType);
  }, [priceType]);


  useEffect(() => {
    return () => {
      setSearchResults([]); // 검색 결과 초기화
    };
  }, [setSearchResults]);

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
    if (!selectedProduct || !selectedKind) {
      alert("품목이나 품종이 선택되지 않았습니다.");
      return; // 빈 값일 경우 서버 요청을 하지 않음
    }

    setLoading(true);
    setError(null);
    setSearchResults([]);

    let adjustedStartDate = startDate;
    if (startDate === endDate) {
      const date = new Date(startDate);
      date.setDate(date.getDate() - 1); // 하루 빼기
      adjustedStartDate = date.toISOString().split("T")[0]; // ISO 문자열로 변환
    }
  
  
    const selectedItemCode =
      FarmData[selectedProduct]?.[0]?.p_itemcode || "";

      const selectedKindCode = selectedKind || "";
    
    console.log("selectedKindCode:", selectedKindCode);
    console.log("selectedKind:", selectedKind);
    console.log("Available kinds:", FarmData[selectedProduct]);
    

    const apiUrl =
      priceType === "retail"
        ? `${API_BASE_URL}/retail/price/all`
        : `${API_BASE_URL}/wholeSale/price/all`;

    const requestData = {
      ...priceRequestDTO,
      p_startday: adjustedStartDate,
      p_endday: endDate,
      p_itemcode: selectedItemCode,
      p_kindcode: selectedKindCode, // FarmData에서 가져온 값
    };

      
    console.log("내가보낸데이터",requestData);


    try {
      const response = await axios.post(apiUrl, requestData);
      const filteredResults = response.data.filter((item) => item.countyname === "평균");
      setSearchResults(filteredResults);

      if (!filteredResults || filteredResults.length === 0) {
        setError("해당 품목을 찾을 수 없습니다.");
        return;
      }

      console.log("filteredResults", filteredResults);

      // 평균 가격 계산
      const total = filteredResults.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
      const average = total / (filteredResults.length || 1);

      // Recoil Atom에 평균 가격 저장
      setAveragePrice(average);
      console.log("요청데이터", response);
      console.log("평균데이터", filteredResults);

      console.log("합계", total);

      console.log("평균", average);


      // 제목 업데이트
      const regionName =
        regions.find((region) => region.code === priceRequestDTO.p_countrycode)?.name || "전국";
      const productName = FarmData[selectedProduct]?.[0]?.itemname || selectedProduct || "전체";
      const kindName =
        FarmData[selectedProduct]?.find((item) => item.p_kindcode === selectedKind)?.kindname ||
        selectedKind ||
        "품종 없음";

      setTitle(`${regionName} ${productName}의 (품종:${kindName}) 평균 가격`);
    } catch (err) {
      setError("데이터 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="farmInfo-container">
      <h2>소매 · 도매 날짜별 평균가격</h2>
      {/* 조건부로 주말과 공휴일 메시지 표시 */}
      {searchResults.length === 0 && !loading && (
        <p className="FarmInfo-warning-message">※주말과 공휴일은 조회가 불가합니다.</p>
      )}
      <div className="farmInfo-datePicker-container">
        <label className="farmInfo-datePicker-label">기간:</label>
        <DatePicker
          selected={new Date(startDate)}
          onChange={(date) => setStartDate(date.toISOString().split("T")[0])}
          dateFormat="yyyy.MM.dd"
          locale={ko}
          placeholderText="날짜를 선택해주세요"
        />
        <span>~</span>
        <DatePicker
          selected={new Date(endDate)}
          onChange={(date) => setEndDate(date.toISOString().split("T")[0])}
          dateFormat="yyyy.MM.dd"
          locale={ko}
          placeholderText="날짜를 선택해주세요"
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
          <select   onChange={(e) => {
      const value = e.target.value === "" ? "" : e.target.value; // 전체 선택 시 빈 문자열
      setPriceRequestDTO({ ...priceRequestDTO, p_countrycode: value });
    }}>
            <option value="">전체</option>
            {regions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.name}
              </option>
            ))}
          </select>
          {!loading && error && <p className="FarmInfo-warning-message">{error}</p>}
        </div>
      </div>

      <div className="farmInfo-button-container">
        <button
          onClick={() => {
            setPriceType("retail");
            handleSearch("retail"); // 소매가로 검색 시 즉시 실행
          }}
        >
          소매가로 검색
        </button>
        <button
          onClick={() => {
            setPriceType("wholeSale");
            handleSearch("wholeSale"); // 도매가로 검색 시 즉시 실행
          }}
        >
          도매가로 검색
        </button>
      </div>

      {searchResults.length > 0 &&
        <div className="farmInfo-result-wrapper">
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
        </div>
      }
      {/* Graph 컴포넌트 */}
      {searchResults.length > 0 && <Graph />}
    </div>
  );
};

export default FarmInfo;
