import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const PostDetail = () => {
    const navigate = useNavigate()

    const [board, setBoard] = useState({
        title: '',
        userNick: '',
        content: ''
    })

    const userNick = localStorage.getItem('userNick'); //로컬스토리지에 닉네임을 변수에저장


    useEffect(() => {
        const getBoardData = async () => {
            try {
                const response = await axios.get(`http://localhost:7070/board/${userNick}`)
                if (response.data.data && response.data.data.length > 0) {
                    setBoard(response.data.data[0])
                }
            } catch (error) {
                console.error('error :', error)
            }
        }
        if (userNick) { //닉네임이 있으면 게시글 가져오기
            getBoardData()
        }
    }, [userNick])//userNick이 변경될 때 마다 호출
    if (!board.title) {
        return
    }

    return (
        <div>
            <h1>제목 : {board.title}</h1>
            <h2>닉네임 : {board.userNick}</h2>
            <p>내용 : {board.content}</p>
        </div>
    )
}
export default PostDetail