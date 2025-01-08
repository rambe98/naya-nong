import { atom } from "recoil";

// 게시글 내용을 저장하는 상태
export const contentAtom = atom({
    key: "content", // 고유 키로 Recoil 상태를 식별
    default: "", // 게시글 내용의 초기값은 빈 문자열
});

// 작성 일자를 저장하는 상태
export const dateAtom = atom({
    key: 'date', // 고유 키로 Recoil 상태를 식별
    default: null, // 작성 일자의 초기값은 null
});

// 사이드바의 가시성을 제어하는 상태
export const isSidebarVisibleAtom = atom({
    key: 'isSidebarVisible', // 고유 키로 Recoil 상태를 식별
    default: false, // 사이드바가 기본적으로 숨겨져 있음
});

// 특정 게시글의 고유 번호를 저장하는 상태
export const bodNumAtom = atom({
    key: 'bodNumAtom', // 고유 키로 Recoil 상태를 식별
    default: null, // 게시글 번호의 초기값은 null
});

// 게시판 검색 결과를 저장하는 상태
export const searchboardResultsAtom = atom({
    key: "searchboardResultsAtom", // 고유 키로 Recoil 상태를 식별
    default: [], // 검색 결과의 초기값은 빈 배열
});
