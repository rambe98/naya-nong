import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop 컴포넌트
 * - React Router의 페이지 전환 시 스크롤 위치를 최상단으로 이동시키는 컴포넌트
 * - 모든 라우트에 대해 적용 가능하며, 페이지 전환 시 스크롤 상태를 초기화함
 */
const ScrollToTop = () => {
  // 현재 라우트의 경로를 가져옴
  const { pathname } = useLocation();

  useEffect(() => {
    /**
     * 페이지가 전환될 때 실행
     * - `document.documentElement.scrollTo`와 `document.body.scrollTo`를 사용하여
     *   스크롤 위치를 최상단으로 이동시킴
     * - `behavior: "smooth"` 옵션으로 부드러운 스크롤 효과를 추가
     */

    //현재 HTML문서 루트의 스크롤 위치는 없어도 작동은 잘하지만 혹시모를 오류에 대비함.
    if (document.documentElement) {
      // HTML 문서 루트의 스크롤 위치를 최상단으로 이동
      document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (document.body) {
      // Body 엘리먼트의 스크롤 위치를 최상단으로 이동
      document.body.scrollTo({ top: 0, });
    }
  }, [pathname]); // 경로(pathname)가 변경될 때마다 이 효과가 실행됨

  // 렌더링할 UI가 없으므로 null 반환
  return null;
};

export default ScrollToTop;
