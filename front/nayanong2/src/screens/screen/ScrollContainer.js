import React, { useEffect, useRef, forwardRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import { scrollAtom } from "../../recoil/ScrollRecoil";

// ScrollContainer 컴포넌트: 자식 요소를 감싸며 스크롤 상태를 관리하는 컴포넌트
const ScrollContainer = forwardRef(({ children }, ref) => {
  const containerRef = useRef(null); // DOM 요소를 참조하기 위한 내부 참조 생성
  const setScrollPosition = useSetRecoilState(scrollAtom); // Recoil 상태를 업데이트하기 위한 함수 가져오기
  const [lastScrollTop, setLastScrollTop] = useState(0); // 이전 스크롤 위치를 저장하는 상태, 초기값은 0

  // 스크롤 이벤트 처리 및 상태 업데이트를 위한 useEffect
  useEffect(() => {
    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
      if (containerRef.current) { // 참조된 DOM 요소가 존재하는 경우에만 실행
        const scrollTop = containerRef.current.scrollTop; // 현재 스크롤 위치 가져오기
        setScrollPosition(scrollTop); // Recoil 상태로 현재 스크롤 위치 저장
        setLastScrollTop(scrollTop); // 현재 스크롤 위치를 lastScrollTop 상태에 저장
      }
    };

    const container = containerRef.current; // 참조된 DOM 요소 가져오기
    if (container) {
      container.addEventListener("scroll", handleScroll); // 스크롤 이벤트 리스너 등록
    }

    // 클린업 함수: 컴포넌트가 언마운트되거나 의존성이 변경될 때 실행
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll); // 스크롤 이벤트 리스너 제거
      }
    };
  }, [setScrollPosition, lastScrollTop]); // 의존성 배열: 상태 업데이트 함수와 이전 스크롤 상태를 감시

  return (
    <div
      ref={(node) => {
        containerRef.current = node; // 내부 참조를 DOM 노드에 연결
        if (typeof ref === "function") {
          ref(node); // 함수형 ref 처리
        } else if (ref) {
          ref.current = node; // 객체형 ref 처리
        }
      }}
<<<<<<< HEAD
      className="ScrollContainer"
      style={{ height: "100vh", overflowY: "auto", overflowX: "hidden"}}
=======
      className="ScrollContainer" // CSS 클래스 추가
      style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }} // 스타일 적용: 세로 스크롤 활성화, 가로 스크롤 비활성화
>>>>>>> 9049cda8736d39708ccb1c71054d4b0504740584
    >
      {children} {/* 자식 컴포넌트를 렌더링 */}
    </div>
  );
});

<<<<<<< HEAD
export default ScrollContainer;
=======
export default ScrollContainer; // ScrollContainer 컴포넌트를 외부에서 사용 가능하도록 내보냄
>>>>>>> 9049cda8736d39708ccb1c71054d4b0504740584
