import { atom } from "recoil";

//게시글 내용
export const contentAtom = atom({
    key: "content",
    default: "",
})

//작성일자
export const dateAtom = atom({
    key: 'date',
    default: null,
})

//사이드 바
export const isSidebarVisibleAtom = atom({
    key: 'isSidebarVisible',
    default: false,
})
