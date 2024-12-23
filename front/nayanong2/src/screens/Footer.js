import React from "react";
import "../css/Footer.css";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="footer-container">
      <img src={logo} alt="농업 정보 플랫폼 로고" className="footer-logo" />
      <div className="footer-content">
        <p>© 2024 농업 정보 플랫폼 - All Rights Reserved.</p>
        <p>
          데이터 출처:{" "}
          <a
            href="https://www.kamis.or.kr/customer/main/main.do"
            target="_blank"
            rel="noopener noreferrer"
          >
            KAMIS 농산물유통정보
          </a>
        </p>
        <p>제작자: Ogh, Ysb, Kjs, Cdu</p>
        <p>
          문의:{" "}
          <a href="mailto:support@farmplatform.com">
          rambe0516@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
