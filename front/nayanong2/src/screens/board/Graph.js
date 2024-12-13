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
    const priceData = useRecoilValue(priceDataAtom); // Recoil에서 전체 데이터 가져오기

    // 오늘 날짜와 7일 전 날짜 계산
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // 데이터를 필터링하여 최근 7일 데이터만 남기기
    const filteredData = priceData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= sevenDaysAgo && itemDate <= today;
    });

    return (
        <div
            style={{
                width: "70%",
                maxWidth: "900px",
                height: "300px",
                margin: "20px auto",
                border: "1px solid #FFFFFF",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#FFF8E6",
                padding: "16px",
            }}
        >
            <h2
                style={{
                    textAlign: "center",
                    fontFamily: "'SSFlowerRoad', sans-serif",
                    fontSize: "20px",
                    color: "#d4a373",
                    borderBottom: "1.5px solid #d4a373",
                    paddingBottom: "8px",
                    marginBottom: "16px",
                }}
            >
                평균 가격 선 그래프 (최근 7일)
            </h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={filteredData} // 필터링된 데이터만 그래프에 전달
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
                    <YAxis
                        tickFormatter={(value) => `₩${value.toLocaleString()}`}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                    />
                    <Tooltip
                        formatter={(value) => `₩${value.toLocaleString()}`}
                        contentStyle={{
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #d4a373",
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
                        type="monotone"
                        dataKey="price"
                        stroke="#d4a373"
                        strokeWidth={2}
                        dot={{ stroke: "#d4a373", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Graph;
