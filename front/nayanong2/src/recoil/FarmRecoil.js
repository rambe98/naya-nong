import { atom } from "recoil";
import itemMappings from "../assets/FarmData.json"

// p_startday 코드
const startDateState = new Date();
startDateState.setDate(startDateState.getDate() - 1);

const startDateStateString = startDateState.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식
export const startDateStateAtom = atom({
    key: 'startDateState',  // 고유한 키
    default: startDateStateString,  // 기본값을 오늘 날짜로 설정
});


// p_endday 코드
const endDateState = new Date();
const endDateStateString = endDateState.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식
export const endDateStateAtom = atom({
    key: 'endDateState',  // 고유한 키
    default: endDateStateString,  // 기본값을 오늘 날짜로 설정
});


// 지역 코드
export const countryCodeStateAtom = atom({
    key: 'countryCodeState',
    default: '',
});

// 반환 타입
export const returnTypeState = atom({
    key: 'returnTypeState',
    default: 'json',
});

// 요청 데이터
export const priceRequestDTOAtom = atom({
    key: "priceRequestDTO",
    default: {
        p_startday: startDateStateString,// 조회 시작 날짜
        p_endday: endDateStateString,   // 조회 종료 날짜
        p_itemcategorycode: "",  // 부류 코드
        p_itemcode: "", // 품목 코드 
        p_kindcode: "",                   // 품종 코드
        p_productrankcode: "",  // 등급 코드
        p_countrycode: "",                // 지역 코드
        p_returntype: "json",             // 반환 타입
    }
});
// 하루 가격 데이터 상태 (priceDataAtom)
export const priceDataAtom = atom({
    key: "priceDataAtom", // 상태의 고유 키
    default: [],          // 기본값은 빈 배열
});

// 일주일 가격 데이터 상태
export const recentSevenDaysDataAtom = atom({
    key: "recentSevenDaysDataAtom",
    default: [],
});

export const farmDataAtom = atom({
    key: "farmDataAtom",
    default: itemMappings,
})  

//선택된 아이템을 저장해주는 상태
export const selectedItemAtom = atom({
    key: "selectedItemAtom", // 고유 키
    default: null, // 기본값은 null
});

//도매와 소매를 관리해주는 상태
export const priceTypeCodeStateAtom = atom({
    key: 'priceTypeCodeStateAtom',
    default: '',
});

//그래프의 하루가격 관리 상태
export const graphPriceDataAtom = atom({
    key: "graphPriceDataAtom", // 고유한 키
    default: [], // 초기값: 빈 배열
  });