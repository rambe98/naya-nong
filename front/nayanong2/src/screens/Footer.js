import React from "react";
import "../css/Footer.css";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-logo-container">
        <img src={logo} alt="농업 정보 플랫폼 로고" className="footer-logo" />
      </div>
      <div className="footer-content">
        <p>© 2024 농업 정보 플랫폼 - All Rights Reserved.</p>
        <p>
          문의: <a href="mailto:support@farmplatform.com">support@farmplatform.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
