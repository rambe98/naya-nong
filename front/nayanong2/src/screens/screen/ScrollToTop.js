import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop 컴포넌트
 * - React Router의 페이지 전환 시 스크롤 위치를 최상단으로 이동시키는 컴포넌트
 * - ScrollContainer를 대상으로 스크롤 위치를 조정함
 */
const ScrollToTop = ({ containerRef }) => {
  const { pathname } = useLocation(); // 현재 라우트 경로 가져오기

  useEffect(() => {
    // 스크롤 컨테이너가 유효하면 최상단으로 이동
    if (containerRef && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, containerRef]); // 경로 변경 또는 참조 변경 시 실행

  return null; // UI를 렌더링하지 않음
};

export default ScrollToTop;
