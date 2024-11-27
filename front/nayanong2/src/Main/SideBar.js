import React from "react";
import { BiMessage } from "react-icons/bi";
import Main from "./Main";
import '../MainCss/SideBar.css'

const SideBar = () => {

    return (
        <div className="sidebarContainer">
            <ul>
                <li style={{color:'black'}}><a>공지사항</a></li>
                <li><a>자유게시판</a></li>
            </ul>
        </div>
    )
}
export default SideBar