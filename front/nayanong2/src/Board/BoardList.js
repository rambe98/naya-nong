import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BoardList = () => {

    const navigate = useNavigate()
    const [boarList, setBoardList] = useState('')


    const getBoardList = async()=>{
        try {
            const response = await axios.get('http://localhost:7070/board')
            setBoardList(response.data.data)
        } catch (error) {
            
        }
    }
    useEffect(()=>{
        getBoardList
    },[])

    return (
        <div>
            
        </div>
    )
}
export default BoardList