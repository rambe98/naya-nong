import React, { useState, useEffect } from "react";
import "../../css/Farm.css";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { priceRequestDTOAtom, countryCodeStateAtom, farmDataAtom, selectedItemAtom, priceDataAtom, startDateStateAtom, endDateStateAtom, priceTypeCodeStateAtom } from "../../recoil/FarmRecoil";
import Graph from "./Graph";

const FarmList = () => {
    //도매(retail) or 소매(wholeSale) 데이터를 선택하는 상태를 관리한다.
    const [priceType, setPriceType] = useRecoilState(priceTypeCodeStateAtom);

    //사용자가 선택한 지역 1101(서울) or 2300(인천)을 전역으로 관리
    const [countryCode, setCountryCode] = useRecoilState(countryCodeStateAtom);

    // 사용자가 껌색창에 입력한 검색어를 관리한다. -> setSearchTerm는 사용자가 검색창에 입력할때마다 값을 업데이트함
    const [searchTerm, setSearchTerm] = useState("");

    //데이터를 서버에서 불러오는 중인지 여부를 관리하는 상태
    const [loading, setLoading] = useState(false);

    //데이터 요청 중 발생한 오류 메시지를 관리한다.
    const [error, setError] = useState(null);

    //value는 읽기만 가능하며 itemMappings은 FarmData.json에서 가져온 매핑 데이터를 사용한다.
    const itemMappings = useRecoilValue(farmDataAtom);

    //서버에 보낼 데이터 요청 객체를 관리한다. 
    /*
       p_startday: startDateStateString,// 조회 시작 날짜
        p_endday: endDateStateString,   // 조회 종료 날짜
        p_itemcategorycode: "",  // 부류 코드
        p_itemcode: "", // 품목 코드 
        p_kindcode: "",                   // 품종 코드
        p_productrankcode: "",  // 등급 코드
        p_countrycode: "",                // 지역 코드
        p_returntype: "json",             // 반환 타입
    */
    const [priceRequestDTO, setPriceRequestDTO] = useRecoilState(priceRequestDTOAtom);

    //데이터 조회의 시작날짜를 관리하며 YYYY-MM-DD형식으로 설정된다.
    const [startDateState, setStartDateState] = useRecoilState(startDateStateAtom)

    //데이터 조회의 종료날짜를 관리하며 YYYY-MM-DD형식으로 설정된다.
    const [endDateState, setEndDateState] = useRecoilState(endDateStateAtom)

    //사용자가 검색창에서 선택한 품목 (예:쌀)을 저장하고 SEtRecoilState이기 때문에 상태를 변경만 한다.
    const setSelectedItemState = useSetRecoilState(selectedItemAtom);

    //서버에서 응답받은 하루 가격 데이터를 저장하며 ([{ date: "2024-12-12", price: 1000 }]) 왼쪽의 예시처럼 데이터를 저장한다.
    const setPriceDataState = useSetRecoilState(priceDataAtom);

    //recoil상태에서 하루 가격 데이터를 읽어온다. useSetRecoilState에서 저장한 값을  useRecoilValue를 통해서 읽어온다.
    const priceData = useRecoilValue(priceDataAtom); // Recoil 상태에서 priceData 구독

    // 지역 변경 핸들러
    const handleContryChange = (e) => {
        //사용자가 선택한 select의 값이 selectedCountry에 저장한다.(서울 or 인천)
        const selectedCountry = e.target.value;

        //selectedCountry에 서울이란 값이 들어오면 1101이 되며 인천이란 값이 들어오면 2300이 된다.
        const newCountryCode = selectedCountry === "서울" ? "1101" : selectedCountry === "인천" ? "2300" : "" 

        //지역코드(1101, 2300)를 업데이트한다.
        setCountryCode(newCountryCode);

        //매개변수로 prevState(이전상태)를 받고
        //...prevState를 사용해 기존 상태를 복사합니다.
        // 기존 상태에 countrycode를 변경합니다.
        //결과적으로는 이전상태를 가져와서 그 상태의 p_countrycode를 newCountryCode로 업데이트한다.
        setPriceRequestDTO((prevState) => ({
            ...prevState,
            p_countrycode: newCountryCode,
        }));
    };

    // 분류 선택 핸들러
    const handlePriceType = (e) => {
        //사용자가 선택한 select의 값이 selectedType 저장한다.(도매 or 소매)
        const selectedType = e.target.value;

        //selectPriceType 도매란 값이 들어오면 retail 이되며 소매란 값이 들어오면 wholeSale이 된다.
        const selectPriceType = selectedType === "도매" ? "retail" : selectedType === "소매" ? "wholeSale" : "";

        //분류(retail, wholeSale)를 업데이트한다.
        setPriceType(selectPriceType);
    };

    // 검색 핸들러
    const handleSearch = (e) => {
        //폼 제출시 발생하는 기본 이벤트(페이지 새로고침)을 취소한다.
        e.preventDefault();

        //검색창(input)에 공백을 제거한 후 내용이 없으면 검색어를 입력하세요라는 에러메시지가 나온다.
        if (!searchTerm.trim()) {
            setError("검색어를 입력하세요.");
            return;
        }

        //matchedItems 변수에 FarmData.json에서 input창의 입력된 검색어로 매칭된 모든 데이터를 가져온다.
        /*
             "감귤": [
        {
            "p_itemcategorycode": "400",
            "p_itemcode": "415",
            "p_kindcode": "00"
        },
        {
            "p_itemcategorycode": "400",
            "p_itemcode": "415",
            "p_kindcode": "01"
        },
        {
            "p_itemcategorycode": "400",
            "p_itemcode": "415",
            "p_kindcode": "02"
        }
        이런 형태의 매핑인데 감귤이 key가되면서 serchTerm에는 감귤이들어가게되고 매칭된 모든 value를 가져옴.
        */
        const matchedItems = itemMappings[searchTerm];

        //매칭된 아이템이 matchedItems에 존재하고 && 길이가 0보다 큰경우만 실행
        if (matchedItems && matchedItems.length > 0) {

            //updatedRequests에 색어에 매칭된 데이터를 기반으로 요청에 필요한 데이터를 생성한다.
            const updatedRequests = matchedItems.map((item) => ({
                p_itemcategorycode: item.p_itemcategorycode, //품목 분류
                p_itemcode: item.p_itemcode, //품목
                p_kindcode: item.p_kindcode, //품종
                p_countrycode: countryCode, // 지역
                p_startday: startDateState, //조회시작일(오늘-1)
                p_endday: endDateState, //조회 종료일(오늘)
            }));

            // 기존 상태를 복사해서 updatedRequests로 업데이트한다.
            //여기서 requests:는 개발자가 임의로 지정한 key값이고
            //기존상태밑에 requests:[예:쌀에대한 value]가 들어가게된다.
            setPriceRequestDTO((prevState) => ({
                ...prevState,
                requests: updatedRequests,
            }));
            //검색된 아이템의 키 값을  Recoil상태 즉 전역에서 사용할수있게 저장하여 다른 컴포넌트에서 참조할수있게 만든다.
            //searchTerm은 사용자가 검색창에 감귤을 입력했을때 감귤이 저장된다.
            setSelectedItemState(searchTerm);
        } else {
            setError("해당 품목을 찾을 수 없습니다.");
        }
    };

    // 상태 변경 후 요청 실행
    //priceRequestDTO값이 변경될때마다 실행되는데 값이 변경될때마다 서버요청을한다고 보면됨.
    //priceRequestDTO.requests가 존재하거나 && 그 배열의 길이가 0보다 클때 실행이된다.
    useEffect(() => {
        if (priceRequestDTO.requests && priceRequestDTO.requests.length > 0) {
            getAllPrice();
        }
    }, [priceRequestDTO]);

    // API 요청 및 응답을 비동기적으로 처리하기 위해 async를 사용한다.
    const getAllPrice = async () => {
        //데이터를 로드 중임을 나타내기위해 상태를 true로 변경
        setLoading(true);

        //이전에 발생했던 오류상태를 초기화시킨다.
        setError(null);

        //apiUrl에 priceType(셀렉트한값)이 소매면 retail의 url로 도매면 wholeSale의 url로 저장된다.
        const apiUrl =
            priceType === "retail" ? "http://localhost:7070/retail/price"
                :
                priceType === "wholeSale" ? "http://localhost:7070/wholeSale/price"
                    : "http://localhost:7070/retail/price"

        try {
            //requests에는 여러개의 요청데이터가 들어있음으로 map함수를 사용해 서버에 요청을보낸다.
            /*
                ex)priceRequestDTO = {
                      p_startday: "2023-12-12",
                      p_endday: "2023-12-13",
                      p_countrycode: "1101",
                requests: [
                        { p_itemcategorycode: "400", p_itemcode: "415", p_kindcode: "00" },
                        { p_itemcategorycode: "401", p_itemcode: "416", p_kindcode: "01" }
                    ]
                };
            */
            const promises = priceRequestDTO.requests.map((request) =>
                axios.post(apiUrl, request)
            );

            //위에서 map함수를 사용해 서버에 요청을 보낸 값이 promises에 담기는데
            //Promise.all(promises)를 사용해 배열에있는 모든 요청이 완료될 때까지 기다린다.
            //요청이 성공하면 responses를 반환하고 요청 중 하나라도 실패하면 전체가 실패한다.
            const responses = await Promise.all(promises);

            //responses는 모든 요청이 배열에 담겨있다.
            //flatMap이란 평탄화다 밑에 예시
            /*
                    [
                        { data: [{...}, {...}] }, // 첫 번째 요청 응답
                        { data: [{...}] },        // 두 번째 요청 응답
                    ]
                       ↑ 평탄화를 안했을때 데이터 ↑
                -----------------------------------------------------------------
                    [
                        {...}, {...}, {...} // 모든 응답의 데이터를 하나로 합친 상태
                    ]
                        ↑ 평탄화를 했을때 데이터 ↑

            */
            const transformedData = responses.flatMap((response) =>
                //평탄화한 데이터를 respons.data.map을 사용해 배열을반환한다.
                response.data.map((item) => ({
                    //item.yyyy=년도(2024) / regday는 split의 /를 사용해 12/12로 구분짓고 join을 사용해 12-12를 반환한다.
                    date: `${item.yyyy}-${item.regday.split('/').join('-')}`,
                    price: parseFloat(item.price.replace(/,/g, "")) || 0,
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
                    onChange={handlePriceType}
                    value={priceType === "retail" ? "도매" : priceType === "wholeSale" ? "소매" : ""}
                >
                    <option value="" disabled>
                        분류
                    </option>
                    <option value="도매">도매</option>
                    <option value="소매">소매</option>
                </select>
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
                                <p>지역: {item.countyname}</p>
                                <p>마켓명: {item.marketname}</p>
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

export default FarmList;
