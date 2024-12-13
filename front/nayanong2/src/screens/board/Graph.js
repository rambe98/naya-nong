import React from "react";
import { useRecoilValue } from "recoil";
import { priceDataAtom } from "../../recoil/FarmRecoil";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const Graph = () => {
    const priceData = useRecoilValue(priceDataAtom); // Recoil에서 가격 데이터 가져오기

    // 오늘 날짜와 일주일 전 날짜 계산
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // 데이터를 필터링하여 일주일 전부터 오늘까지의 데이터만 남기기
    const filteredData = priceData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= sevenDaysAgo && itemDate <= today;
    });

    // 데이터가 없으면 샘플 데이터로 표시
    const sampleData = [
        { date: "2024-12-01", price: 1200 },
        { date: "2024-12-02", price: 1500 },
        { date: "2024-12-03", price: 1800 },
    ];

    return (
        <div
            style={{
                width: "70%", // 화면 너비의 90%로 제한
                maxWidth: "900px",
                height: "300px", // 고정 높이
                margin: "20px auto", // 상단 여백 추가 및 중앙 정렬
                border: "1px solid #FFFFFF", // 메인 색상 테두리
                borderRadius: "10px", // 모서리 둥글게
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // 그림자
                backgroundColor: "#FFF8E6", // 연한 베이지 배경
                padding: "16px", // 내부 여백
            }}
        >
            <h2
                style={{
                    textAlign: "center",
                    fontFamily: "'SSFlowerRoad', sans-serif",
                    fontSize: "20px",
                    color: "#d4a373", // 메인 색상
                    borderBottom: "1.5px solid #d4a373", // 제목 아래 테두리
                    paddingBottom: "8px",
                    marginBottom: "16px",
                }}
            >
                평균 가격 선 그래프
            </h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={filteredData.length > 0 ? filteredData : sampleData} // 필터링된 데이터 사용
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> {/* 격자선 */}
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} /> {/* X축 */}
                    <YAxis
                        tickFormatter={(value) => `₩${value.toLocaleString()}`} // Y축: 가격 단위 표시
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                    />
                    <Tooltip
                        formatter={(value) => `₩${value.toLocaleString()}`} // 툴팁: 가격 단위 표시
                        contentStyle={{
                            backgroundColor: "#FFFFFF", // 툴팁 배경색
                            border: "1px solid #d4a373", // 테두리 색상
                            borderRadius: "5px",

                        }}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        wrapperStyle={{
                            fontSize: "14px",
                            color: "#333",
                        }}
                    />
                    <Line
                        type="monotone" // 선의 곡률을 부드럽게
                        dataKey="price" // 데이터의 키를 price로 설정
                        stroke="#d4a373" // 선 색상
                        strokeWidth={2} // 선 두께
                        dot={{ stroke: "#d4a373", strokeWidth: 2, r: 4 }} // 점 스타일
                        activeDot={{ r: 6, strokeWidth: 2 }} // 활성화된 점 스타일
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Graph;
