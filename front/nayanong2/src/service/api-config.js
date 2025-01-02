let backendHost; // 백엔드 호스트 URL을 저장할 변수

// window 객체: 브라우저에서 실행되는 모든 코드에 접근할 수 있는 최상위 객체
// window.location: 현재 웹 페이지의 URL 정보를 다루는 객체
// window.location.hostname: 현재 페이지의 호스트 이름(도메인)을 반환 (예: localhost, nayanong.site)

// 현재 호스트 이름을 가져옴
const hostname = window && window.location && window.location.hostname;

// 호스트 이름에 따라 백엔드 URL 설정
if (hostname === "localhost") {
    backendHost = "http://localhost:7070"; // 로컬 개발 환경 URL
} else if (hostname === "www.nayanong.site") {
    backendHost = "http://www.nayanong.site:7070"; // 서브도메인 포함 배포 환경 URL
} else if (hostname === "nayanong.site") {
    backendHost = "http://www.nayanong.site:7070"; // 기본 도메인 배포 환경 URL
}

export const API_BASE_URL = `${backendHost}`; // 최종 API URL을 내보냄

