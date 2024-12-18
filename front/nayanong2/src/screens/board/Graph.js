import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useRecoilValue } from "recoil";
import { searchResultsAtom, averagePriceAtom } from "../../recoil/FarmRecoil";

const Graph = () => {
    const searchResults = useRecoilValue(searchResultsAtom) || []; // 기본값으로 빈 배열 설정
    const averagePrice = useRecoilValue(averagePriceAtom); // Recoil Atom에서 평균 가격 가져오기

    // 데이터를 변환하여 X축: 날짜, Y축: 가격
    const formattedData = searchResults
        .filter((item) => item && item.countyname === "평균") // item이 undefined인지 확인
        .map((item) => ({
            date: item.regday,
            price: item.price ? Number(item.price.replace(/,/g, "")) : 0, // item.price가 없을 경우 기본값 설정
        }));

    // Y축 범위 설정을 위한 최소값과 최대값 계산
    const prices = formattedData.map((item) => item.price);
    const minY = prices.length ? Math.floor(Math.min(...prices) / 1000) * 1000 : 0; // 최소값을 1000 단위로 내림
    const maxY = prices.length ? Math.ceil(Math.max(...prices) / 1000) * 1000 : 10000; // 최대값을 1000 단위로 올림
    const middleY = Math.round((minY + maxY) / 2 / 1000) * 1000; // 가운데 값 계산 (1000 단위 반올림)

    return (
        <div className="graph-container">
            <h3>평균 가격 선 그래프</h3>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "10px" }}>
                * 날짜별 그래프에 표시되는 금액은 원 단위로 표시됩니다.
            </p>
            {formattedData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={formattedData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            stroke="#5a5a5a"
                            label={{
                                value: "날짜",
                                position: "insideBottom",
                                dy: 20,
                                fontSize: 14,
                                fill: "#5a5a5a",
                            }}
                        />
                        <YAxis
                            domain={[minY, maxY]} // Y축 범위 설정
                            ticks={[minY, middleY, maxY]} // 3개 값만 표시
                            tickFormatter={(value) => `${value.toLocaleString()}원`} // 정확한 값 표시
                            tick={{ fontSize: 12 }}
                            stroke="#5a5a5a"
                            label={{
                                value: "가격 (원)",
                                angle: -90, // 라벨 가격(원)의 각도
                                position: "insideLeft",
                                dx: -10,
                                fontSize: 14,
                                fill: "#5a5a5a",
                            }}
                        />
                        {/* 툴팁 */}
                        <Tooltip
                            formatter={(value) => [`${value.toLocaleString()}원`, "가격"]} // 정확한 값 표시
                            labelFormatter={(label) => `날짜: ${label}`}
                            contentStyle={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #d4a373",
                                borderRadius: "5px",
                                fontSize: "14px",
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
            ) : (
                <p className="farmInfo-waning-message">분류, 품목, 품종, 지역을 선택하세요.</p>
            )}
        </div>
    );
};

export default Graph;
