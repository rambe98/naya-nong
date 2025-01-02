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
import { Circles } from "react-loader-spinner";

const FarmInfo = () => {
  //Recoil 상태관리
  const [startDate, setStartDate] = useRecoilState(startDateStateAtom); //검색 시작 날짜 상태
  const [endDate, setEndDate] = useRecoilState(endDateStateAtom); //검색 종료 날짜 상태
  const [priceRequestDTO, setPriceRequestDTO] = useRecoilState(priceRequestDTOAtom); //API 요청 데이터 상태
  const [searchResults, setSearchResults] = useRecoilState(searchResultsAtom || []); // 검색 결과 상태
  const [title, setTitle] = useRecoilState(titleAtom); //결과 제목 상태
  const setAveragePrice = useSetRecoilState(averagePriceAtom); //평균 가격 상태 업데이트 함수

  //로컬 상태관리
  const [selectedProduct, setSelectedProduct] = useState("");  //선택된 품목
  const [selectedKind, setSelectedKind] = useState(""); //선택된 품종
  const [loading, setLoading] = useState(false); //로딩상태
  const [error, setError] = useState(null); //에러 상태
  const [priceType, setPriceType] = useState("retail"); // 가격 타입 (도매/소매) 초기값 'retail'로 설정
 
  //카테고리 목록
  const categories = [
    { code: "100", name: "식량작물" },
    { code: "200", name: "채소류" },
    { code: "300", name: "특용작물" },
    { code: "400", name: "과일류" },
  ];

  //지역 목록록
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

  //컴포넌트 언마운트 시 검색 결과 초기화
  useEffect(() => {
    return () => {
      setSearchResults([]); // 검색 결과 초기화
    };
  }, [setSearchResults])

  //선택된 카테고리에 속한 품목 필더링
  const products = Object.keys(FarmData).filter((key) => {
    return FarmData[key]?.some(
      (item) => item.p_itemcategorycode === priceRequestDTO.p_itemcategorycode
    );
  });

  //선택된 품목에 속한 품종 필터링링
  const kinds = selectedProduct
    ? FarmData[selectedProduct]?.map((item) => ({
      kindcode: item.p_kindcode, //품종 코드
      kindname: item.kindname,   //품종 이름
    })) || []
    : [];

  //검색 함수
  const handleSearch = async (type) => {
    //품목과 품종이 선택되지 않았을 경우 경고 후 종료
    if (!selectedProduct || !selectedKind) {
      alert("품목이나 품종이 선택되지 않았습니다.");
      return; // 빈 값일 경우 서버 요청을 하지 않음
    }

     // 검색 유형(도매/소매)에 따라 가격 타입 설정
    setPriceType(type);

    //로딩 및 에러 상태 초기화
    setLoading(true);
    setError(null);
    setSearchResults([]);

    //시작일과 종료일이 같은 경우 시작일을 하루 전으로 보정정
    let adjustedStartDate = startDate;
    if (startDate === endDate) {
      const date = new Date(startDate);
      date.setDate(date.getDate() - 1); // 하루 빼기
      adjustedStartDate = date.toISOString().split("T")[0]; // ISO 문자열로 변환
    }

    //선택된 품목 및 품종 코드
    const selectedItemCode = FarmData[selectedProduct]?.[0]?.p_itemcode || "";
    const selectedKindCode = selectedKind || "";

    //도매/소매 API URL 설정정
    const apiUrl =
      type === "retail"
        ? `${API_BASE_URL}/retail/price/all`
        : `${API_BASE_URL}/wholeSale/price/all`;

    //API 요청 데이터 생성성
    const requestData = {
      ...priceRequestDTO,
      p_startday: adjustedStartDate,
      p_endday: endDate,
      p_itemcode: selectedItemCode,
      p_kindcode: selectedKindCode,
    };

    try {
      //서버에 POST 요청
      const response = await axios.post(apiUrl, requestData);
      // 응답 데이터에서 '평균' 항목 필터링
      const filteredResults = response.data.filter((item) => item.countyname === "평균");
      setSearchResults(filteredResults);
      //검색 결과가 없을 경우 에러 상태 설정
      if (!filteredResults || filteredResults.length === 0) {
        setError("해당 품목을 찾을 수 없습니다.");
        return;
      }

      // 평균 가격 계산
      const total = filteredResults.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
      const average = total / (filteredResults.length || 1);

      // 평균 가격을 Recoil 상태에 저장
      setAveragePrice(average);

      // 결과 제목 업데이트
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
      <h2>도매 · 소매 날짜별 평균가격</h2>

      {!loading && searchResults.length === 0 && (
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
          <select onChange={(e) => {
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
        </div>
      </div>

      {loading && (
        <div className="farmInfo-loading">
          <Circles
            height="100"
            width="100"
            color="#3498db"
            ariaLabel="loading-indicator"
          />
          <p>데이터 로딩 중...</p>
        </div>
      )}

      <div className="farmInfo-button-container">
        <button
          onClick={() => handleSearch("wholeSale")} // 도매가로 검색
        >
          도매가로 검색
        </button>
        <button
          onClick={() => handleSearch("retail")} // 소매가로 검색
        >
          소매가로 검색
        </button>
      </div>

      {!loading && (
        <div className="farmInfo-result-wrapper">
          <div className="farmInfo-result-container">
            {error ? (
              <p>{error}</p>
            ) : searchResults.length > 0 && (
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
      )}
      {searchResults.length > 0 && <Graph />}
    </div>
  );
};

export default FarmInfo;
