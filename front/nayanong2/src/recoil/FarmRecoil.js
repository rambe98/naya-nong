import { atom } from "recoil";
import itemMappings from "../assets/FarmData.json";

// 시작 날짜 상태 관리
// 'YYYY-MM-DD' 형식으로 어제로 설정
const startDateState = new Date();
startDateState.setDate(startDateState.getDate() - 1);
const startDateStateString = startDateState.toISOString().split('T')[0]; // 어제 날짜
export const startDateStateAtom = atom({
    key: 'startDateState',  // 고유 키
    default: startDateStateString,  // 기본값: 어제 날짜
});

// 종료 날짜 상태 관리
// 'YYYY-MM-DD' 형식으로 오늘 날짜로 설정
const endDateState = new Date();
const endDateStateString = endDateState.toISOString().split('T')[0]; // 오늘 날짜
export const endDateStateAtom = atom({
    key: 'endDateState',  // 고유 키
    default: endDateStateString,  // 기본값: 오늘 날짜
});

// 지역 코드를 관리하는 상태
export const countryCodeStateAtom = atom({
    key: 'countryCodeState',
    default: '', // 기본값: 빈 문자열
});

// 반환 타입 상태 관리
export const returnTypeState = atom({
    key: 'returnTypeState',
    default: 'json', // 기본값: JSON 형식 반환
});

// 요청 데이터를 관리하는 상태
export const priceRequestDTOAtom = atom({
    key: "priceRequestDTO", // 고유 키
    default: {
        p_startday: startDateStateString, // 조회 시작 날짜
        p_endday: endDateStateString, // 조회 종료 날짜
        p_itemcategorycode: "", // 부류 코드
        p_itemcode: "", // 품목 코드
        p_kindcode: "", // 품종 코드
        p_productrankcode: "", // 등급 코드
        p_countrycode: "", // 지역 코드
        p_returntype: "json", // 반환 타입
    }
});

// 하루 가격 데이터를 저장하는 상태
export const priceDataAtom = atom({
    key: "priceDataAtom", // 고유 키
    default: [], // 기본값: 빈 배열
});

// 일주일 가격 데이터를 저장하는 상태
export const recentSevenDaysDataAtom = atom({
    key: "recentSevenDaysDataAtom", // 고유 키
    default: [], // 기본값: 빈 배열
});

<<<<<<< HEAD
// JSON 파일에서 가져온 데이터가 기본값으로 설정
export const farmDataAtom = atom({
    key: "farmDataAtom",
    default: itemMappings,
}) 
=======
// 농산물 데이터를 저장하는 상태
export const farmDataAtom = atom({
    key: "farmDataAtom", // 고유 키
    default: itemMappings, // FarmData.json 데이터 사용
});
>>>>>>> 9049cda8736d39708ccb1c71054d4b0504740584

// 선택된 아이템을 저장하는 상태
export const selectedItemAtom = atom({
    key: "selectedItemAtom", // 고유 키
    default: null, // 기본값: 선택되지 않음
});

// 도매/소매 상태를 관리하는 상태
export const priceTypeCodeStateAtom = atom({
    key: 'priceTypeCodeStateAtom', // 고유 키
    default: '', // 기본값: 빈 문자열
});

// 검색 결과를 저장하는 상태
export const searchResultsAtom = atom({
    key: "searchResultsAtom", // 고유 키
    default: [], // 기본값: 빈 배열
});

// 결과 제목을 저장하는 상태
export const titleAtom = atom({
    key: "titleAtom", // 고유 키
    default: "평균 가격 결과", // 기본값: "평균 가격 결과"
});

// 평균 가격을 저장하는 상태
export const averagePriceAtom = atom({
    key: "averagePriceAtom", // 고유 키
    default: 0, // 기본값: 0
});
