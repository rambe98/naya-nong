import axios from 'axios';
import { API_BASE_URL } from "./api-config";


//api : 호출할 API의 경로 (예: /todos, /users)
//method: HTTP 메서드 (예: GET, POST, PUT, DELETE)
//request: 요청에 담을 데이터(주로 POST, PUT 요청에서 사용)
export function call(api, method, request) {
    // Header 설정
    let headers = {
        "Content-Type": "application/json",
    };

    // 로컬 스토리지에서 ACCESS_TOKEN 가져오기
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    if (accessToken) {
        headers["Authorization"] = "Bearer " + accessToken; // Authorization 헤더 추가
    }

    // axios 옵션 설정
    let options = {
        url: API_BASE_URL + api,
        method: method,
        headers: headers,
    };

    // 요청 데이터가 있는 경우 처리
    if (request) {
        options.data = request; // 객체 그대로 전달 (axios가 자동으로 JSON 변환)
    }

    // axios 요청
    return axios(options)
        .then((response) => {
            console.log("응답 데이터:", response.data);
            return response.data;
        })
        .catch((error) => {
            console.error("HTTP 요청 오류:", error);
            if (error.response && error.response.status === 403) {
                // 403 오류 발생 시 로그인 페이지로 리다이렉트
                window.location.href = "/login";
            }
            throw error; // 오류를 호출한 곳에서 처리하도록 전달
        });
}

export function signin(userDTO) {
    return call("/users/signin", "POST", userDTO)
        .then((response) => {
            if (response && response.token) {
                console.log("넘겨받은데이터 : ",response);
                
                localStorage.setItem("ACCESS_TOKEN", response.token);
                localStorage.setItem('userId', response.user.userId);
                localStorage.setItem('clientNum', response.user.clientNum);
                localStorage.setItem('userNick', response.user.userNick);
                return response; // 성공 시 데이터 반환
            } else {
                throw new Error("토큰이 반환되지 않았습니다.");
            }
        })
        .catch((error) => {
            console.error("signin 실패:", error);
            throw error; // 호출한 곳에서 에러를 처리할 수 있도록 다시 던짐
        });
}