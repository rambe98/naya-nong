import { atom } from "recoil";

//로그인 성공 여부 전역상태
export const loginsuccess = atom({
    key: 'loginsuccess',
    default : false,
});

//clientNum 전역상태
export const clientNum = atom({
    key: 'clientNum',
    default: null,
});