import { atom } from "recoil";
import itemMappings from "../assets/FarmData.json"

// 'YYYY-MM-DD' 형식으로 시작 날짜 설정
const startDateState = new Date();
const startDateStateString = startDateState.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식

// 시작 날짜
export const startDateStateAtom = atom({
    key: 'startDateState',
    default: '',
});

// 종료 날짜
export const endDateStateAtom = atom({
    key: 'endDateState',
    default: '',
});

// 품목 카테고리
export const itemCategoryStateAtom = atom({
    key: 'itemCategoryState',
    default: '',
});

// 품목 코드
export const itemCodeStateAtom = atom({
    key: 'itemCodeState',
    default: ""
});

// 품종 코드
export const kindCodeStateAtom = atom({
    key: 'kindCodeState',
    default: '',
});

// 제품 등급 코드
export const productRankCodeStateAtom = atom({
    key: 'productRankCodeState',
    default: '',
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
        p_startday: startDateStateString, // 조회 시작 날짜
        p_endday: startDateStateString,   // 조회 종료 날짜
        p_itemcategorycode: "",  // 부류 코드
        p_itemcode: "", // 품목 코드 
        p_kindcode: "",                   // 품종 코드
        p_productrankcode: "",  // 등급 코드
        p_countrycode: "",                // 지역 코드
        p_returntype: "json",             // 반환 타입
    }
});
// 가격 데이터 상태 (priceDataAtom)
export const priceDataAtom = atom({
    key: "priceDataAtom", // 상태의 고유 키
    default: [],          // 기본값은 빈 배열
});

export const farmDataAtom = atom({
    key:"farmDataAtom",
    default:itemMappings,
})