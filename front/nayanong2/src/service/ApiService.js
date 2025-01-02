import axios from 'axios';
import { API_BASE_URL } from "./api-config";


//api : 호출할 API의 경로 (예: /todos, /users)
//method: HTTP 메서드 (예: GET, POST, PUT, DELETE)
//request: 요청에 담을 데이터(주로 POST, PUT 요청에서 사용)
export function call(api, method, request) {
    let headers = {
        "Content-Type": "application/json", // 요청 데이터 형식 JSON 설정
    };

    const accessToken = localStorage.getItem("ACCESS_TOKEN"); // 로컬 스토리지에서 ACCESS_TOKEN 가져오기
    if (accessToken) {
        headers["Authorization"] = "Bearer " + accessToken; // Authorization 헤더 추가
    }

    let options = {
        url: API_BASE_URL + api, // API 경로 설정
        method: method, // HTTP 메서드 설정
        headers: headers, // 요청 헤더 설정
    };

    if (request) {
        options.data = request; // 요청 데이터 설정
    }

    return axios(options) // axios 요청 보내기
        .then((response) => {
            return response.data; // 성공 시 응답 데이터 반환
        })
        .catch((error) => {
            console.error("HTTP 요청 오류:", error); // 요청 에러 로그 출력
            if (error.response && error.response.status === 403) {
                window.location.href = "/login"; // 403 오류 시 로그인 페이지로 리다이렉트
            }
            throw error; // 오류를 호출한 곳으로 전달
        });
}

// 로그인 API 호출 함수
export function signin(userDTO) {
    return call("/users/signin", "POST", userDTO) // /users/signin 경로로 POST 요청
        .then((response) => {
            if (response && response.token) {
                localStorage.setItem("ACCESS_TOKEN", response.token); // 토큰을 로컬 스토리지에 저장
                localStorage.setItem('userId', response.user.userId); // 사용자 ID 저장
                localStorage.setItem('clientNum', response.user.clientNum); // 사용자 고유번호 저장
                localStorage.setItem('userNick', response.user.userNick); // 사용자 닉네임 저장
                return response; // 성공 시 응답 데이터 반환
            } else {
                throw new Error("토큰이 반환되지 않았습니다."); // 토큰이 없을 경우 에러 발생
            }
        })
        .catch((error) => {
            console.error("signin 실패:", error); // 로그인 실패 로그 출력
            throw error; // 에러를 호출한 곳으로 전달
        });
}