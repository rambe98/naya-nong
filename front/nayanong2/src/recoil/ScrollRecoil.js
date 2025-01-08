import { atom } from 'recoil'

export const scrollAtom = atom({
  key: 'scrollAtom', // Recoil 상태를 식별하기 위한 고유 키
  default: 0, // 기본값은 0으로 설정하여 초기 스크롤 위치를 의미
}); 
// 이 상태는 현재 페이지의 스크롤 위치를 저장합니다. 
// 주로 헤더 표시 여부, 특정 버튼의 가시성, 또는 스크롤 기반 UI 변화를 제어하는 데 사용됩니다.
// 예를 들어, 스크롤 위치가 특정 값 이상일 때 헤더를 숨기거나 특정 요소를 표시하는 로직에 활용됩니다.
