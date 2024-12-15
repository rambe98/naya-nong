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

const Graph = ({ searchResults }) => {
  console.log("Graph Data:", searchResults); // 디버깅용 로그

  // 데이터를 변환하여 X축: 날짜, Y축: 가격
  const formattedData = searchResults
    .filter((item) => item.countyname === "평균") // '평균' 데이터만 필터링
    .map((item) => ({
      date: item.regday, // 날짜
      price: parseFloat(item.price) * 1000, // 가격을 원 단위로 변환 (x 1000)
    }));

  return (
    <div className="graph-container">
      <h3>평균 가격 선 그래프</h3>
      {formattedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={formattedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }} // X축 레이블을 위한 여백 추가
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              stroke="#5a5a5a"
              label={{
                value: "날짜", // 레이블 텍스트
                position: "insideBottom", // X축 아래 표시
                dy: 20, // 아래로 20px 추가 이동
                fontSize: 14, // 레이블 글씨 크기
                fill: "#5a5a5a", // 레이블 색상
              }}
            />
            <YAxis
              tickFormatter={(value) => `${value.toLocaleString()}원`}
              tick={{ fontSize: 12 }}
              tickLine={false}
              stroke="#5a5a5a"
              label={{
                value: "가격 (원)",
                angle: -90,
                position: "insideLeft",
                dx: -10,
                fontSize: 14,
                fill: "#5a5a5a",
              }}
            />
            <Tooltip
              formatter={(value) => `${value.toLocaleString()}원`} // '₩' 제거하고 '원'으로 표시
              labelFormatter={(label) => `날짜: ${label}`}
              itemStyle={{ color: "#333" }} // 텍스트 색상
              formatter={(value) => [`${value.toLocaleString()}원`, "가격"]} // 'price'를 '가격'으로 변경
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
        <p>그래프에 표시할 데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default Graph;
