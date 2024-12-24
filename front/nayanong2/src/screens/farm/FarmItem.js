import React, { useEffect, useState, useRef } from "react";
import "../../css/FarmItem.css";
import carrotImage from '../../assets/carrot.png';
import spinachImage from '../../assets/spinach.png';
import sweetpotatoImage from '../../assets/sweetpotato.png';
import broccoliImage from '../../assets/broccoli.png';
import bananaImage from '../../assets/banana.png';
import axios from "axios";
import farmData from '../../assets/FarmData.json';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Circles } from "react-loader-spinner";
import { API_BASE_URL } from "../../service/api-config";

// 날짜에서 하루 전 날짜 구하기
const getPreviousDay = (startDateState) => {
    const date = new Date(startDateState);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
};

// Chart.js 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const FarmItem = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [priceData, setPriceData] = useState([]);
    const [countryCode, setCountryCode] = useState("");
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [clicked, setClicked] = useState(false); //클릭상태 관리

    // 화면 크기가 변경될 때 마다 key를 업데이트 하여 차트를 재렌더링
    const [chartKey, setChartKey] = useState(Date.now())// 처음 렌더링 시 고유 key 생성

    const items = ["시금치", "브로콜리", "당근", "바나나", "고구마"];

    const [startDateState, setStartDateState] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split('T')[0];
    });

    const [endDateState, setEndDateState] = useState(() => {
        const date = new Date();
        return date.toISOString().split('T')[0];
    });

    const itemImages = {
        시금치: {
            image: spinachImage,
            unit: "(100g 상품 기준)"
        },
        브로콜리: {
            image: broccoliImage,
            unit: "(1개 상품 기준)"
        },
        당근: {
            image: carrotImage,
            unit: "(1kg 상품 기준)"
        },
        바나나: {
            image: bananaImage,
            unit: "(100g 상품 기준)"
        },
        고구마: {
            image: sweetpotatoImage,
            unit: "(1kg 상품 기준)"
        }
    };

    const chartRef = useRef(null); // Chart.js에 접근할 수 있는 ref 생성

    const getAllPrice = async (farmItemRequests) => {
        setLoading(true);
        setError(null);
        const apiUrl = `${API_BASE_URL}/retail/price`;

        try {
            const promises = farmItemRequests.map((request) =>
                axios.post(apiUrl, request)
            );
            const responses = await Promise.all(promises);

            let farmItemData = responses.flatMap((response) => {
                if (Array.isArray(response.data)) {
                    return response.data.map((item) => {
                        let currentStartDay = item.p_startday || startDateState;
                        return {
                            date: item.yyyy && item.regday ? `${item.yyyy}-${item.regday.split('/').join('-')}` : "",
                            price: item.price ? parseFloat(item.price.replace(/,/g, "")) : 0,
                            countyname: item.countyname,
                            itemname: item.itemname,
                            marketname: item.marketname,
                            kindname: item.kindname,
                            p_startday: currentStartDay,
                            p_endday: endDateState,
                        };
                    }).filter(item => item !== null);
                } else {
                    setError("서버에서 데이터를 잘못 반환했습니다.");
                    return [];
                }
            });

            farmItemData = farmItemData.filter((item) => item.countyname === "평균");

            if (farmItemData.length === 0) {
                const newStartDateState = getPreviousDay(startDateState);
                setStartDateState(newStartDateState);
                return;
            }

            setPriceData(farmItemData);
            setError(null);
        } catch (error) {
            console.error("Error fetching data:", error);
            setPriceData([]);
            setError("서버 요청 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initialItem = items[0];
        const matchedItems = farmData[initialItem];

        if (matchedItems && matchedItems.length > 0) {
            const updatedRequests = matchedItems.map((item) => ({
                p_itemcategorycode: item.p_itemcategorycode,
                p_itemcode: item.p_itemcode,
                p_kindcode: item.p_kindcode,
                p_countrycode: countryCode,
                p_startday: startDateState,
                p_endday: endDateState,
            }));

            getAllPrice(updatedRequests);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current) {
                const chart = chartRef.current.chartInstance;
                if (chart) {
                    chart.resize(); // 차트 리사이즈
                    chart.update(); // 차트 업데이트
                }
            }
        };

        // 화면 크기 변경 시마다 차트 리사이즈
        window.addEventListener('resize', handleResize);

        // 컴포넌트 언마운트 시 리스너 정리
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const itemChart = {
        labels: priceData.map((item) => item.date),
        datasets: [
            {
                label: "소매가 그래프",
                data: priceData.map((item) => item.price),
                fill: false,
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.1,
            },
        ],
    };

    const itemChartOption = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    boxWidth: 0,
                    usePointStyle: true,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "날짜",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "가격 (원)",
                },
            }
        },
    };


    useEffect(() => {
        const handleResize = () => {
            //화면 크기가 바뀌면 key를 갱신
            setChartKey(Date.now())
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    const handleNext = async () => {
        const nextItemIndex = (currentItemIndex + 1) % items.length;
        setCurrentItemIndex(nextItemIndex);
        const nextItem = items[nextItemIndex];
        const matchedItems = farmData[nextItem];

        if (matchedItems && matchedItems.length > 0) {
            const updatedRequests = matchedItems.map((item) => ({
                p_itemcategorycode: item.p_itemcategorycode,
                p_itemcode: item.p_itemcode,
                p_kindcode: item.p_kindcode,
                p_countrycode: countryCode,
                p_startday: startDateState,
                p_endday: endDateState,
            }));

            getAllPrice(updatedRequests);
        } else {
            setError("해당 품목을 찾을 수 없습니다.");
        }
    };

    const handlePrevious = async () => {
        const prevItemIndex = (currentItemIndex - 1 + items.length) % items.length;
        setCurrentItemIndex(prevItemIndex);
        const prevItem = items[prevItemIndex];
        const matchedItems = farmData[prevItem];

        if (matchedItems && matchedItems.length > 0) {
            const updatedRequests = matchedItems.map((item) => ({
                p_itemcategorycode: item.p_itemcategorycode,
                p_itemcode: item.p_itemcode,
                p_kindcode: item.p_kindcode,
                p_countrycode: countryCode,
                p_startday: startDateState,
                p_endday: endDateState,
            }));

            getAllPrice(updatedRequests);
        } else {
            setError("해당 품목을 찾을 수 없습니다.");
        }
    };

    return (
        <div className="farmItemContainer">
            <h2>현대인에게 필요한 농산물 <span className="highlight">Top 5</span></h2>
            <div className="farmItemImageContainer">
                <div className="farmImageContainer">
                    <img
                        src={itemImages[items[currentItemIndex]].image}
                        alt={items[currentItemIndex]}
                        className="farmItem"
                    />
                    <h2>{items[currentItemIndex]}</h2>
                    <p>{itemImages[items[currentItemIndex]].unit}</p> {/* 단위 표시 */}
                </div>
                <div className="loadingContainer">
                    {loading ? (
                        <div className="ItemLoading">
                            <Circles
                                height="100"
                                width="100"
                                color="#3498db"
                                ariaLabel="loading-indicator"
                            />
                            <p>데이터 로딩 중...</p>
                        </div>
                    ) : (
                        priceData.length > 1 ? (
                            <>
                                <div className="farmDateContainer">
                                    <div className="itemDate0">
                                        <p>기준 날짜 </p>
                                        <h4>{priceData.slice(-2)[0].date}</h4>
                                        <p>평균 소매가</p>
                                        <h4>{new Intl.NumberFormat().format(priceData.slice(-2)[0].price)}원</h4>
                                    </div>
                                    <div className="itemDate1">
                                        <p>기준 날짜 </p>
                                        <h4>{priceData.slice(-2)[1].date}</h4>
                                        <p>평균 소매가</p>
                                        <h4>{new Intl.NumberFormat().format(priceData.slice(-2)[1].price)}원</h4>
                                    </div>
                                </div>
                                <div className="itemChartContainer">
                                    {priceData.length > 0 && <Line key={chartKey} data={itemChart} options={itemChartOption} />}
                                </div>
                            </>
                        ) : (
                            <p>가격 데이터가 충분하지 않습니다.</p>
                        )
                    )}
                </div>
            </div>
            <div className="buttonContainer">
                <button onClick={handlePrevious} className="previousButton">&lt;</button>
                <button onClick={handleNext} className="nextButton">&gt;</button>
            </div>
        </div>
    );
};

export default FarmItem;
