import React, { useEffect, useRef, forwardRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import { scrollAtom } from "../../recoil/ScrollRecoil";

const ScrollContainer = forwardRef(({ children }, ref) => {
  const containerRef = useRef(null); // 내부 참조 생성
  const setScrollPosition = useSetRecoilState(scrollAtom);
  const [lastScrollTop, setLastScrollTop] = useState(0); // 이전 스크롤 위치 상태

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        setScrollPosition(scrollTop); // Recoil 상태 업데이트

        // 이전 스크롤 위치와 현재 스크롤 위치 비교
        if (scrollTop > lastScrollTop) {
          console.log("Scrolling down"); // 아래로 스크롤
        } else {
          console.log("Scrolling up"); // 위로 스크롤
        }

        setLastScrollTop(scrollTop); // 현재 위치를 마지막 위치로 저장
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [setScrollPosition, lastScrollTop]);

  return (
    <div
      ref={(node) => {
        containerRef.current = node; // 내부 참조 설정
        if (typeof ref === "function") {
          ref(node); // 함수형 ref 처리
        } else if (ref) {
          ref.current = node; // 객체형 ref 처리
        }
      }}
      className="ScrollContainer"
      style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }}
    >
      {children}
    </div>
  );
});

export default ScrollContainer;
