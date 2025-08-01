import { getSalesQuantityByDiscountPolicy } from "@/apis/statistics/salesQuantityStatistics/SalesQuantityStatistics";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { NavLink } from "react-router-dom";
import { BarChart, XAxis, YAxis, Tooltip, Bar, Cell } from "recharts";

type ChartData = { name: string; total: number };

function SalesQuantityByDiscountPolicy() {
  const [cookies] = useCookies(["accessToken"]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState("");

  const thisYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 5 }, (_, i) => thisYear - 4 + i).sort(
    (a, b) => b - a
  );
  const [selectedYear, setSelectedYear] = useState<number>(thisYear);

  const getCurrentQuarter = () => {
    const month = new Date().getMonth() + 1;
    if (month <= 3) return 1;
    if (month <= 6) return 2;
    if (month <= 9) return 3;
    return 4;
  };
  const [selectedQuarter, setSelectedQuarter] = useState<number>(
    getCurrentQuarter()
  );

  const token = cookies.accessToken as string;

  const onFetchChart = async () => {
    if (!token) return;
    setLoading(true);

    const response = await getSalesQuantityByDiscountPolicy(
      selectedYear,
      selectedQuarter,
      token
    );
    const { code, message, data } = response;

    if (code != "SU") {
      alert(`${message}`);
      return;
    }

    if (Array.isArray(data)) {
      if (data.every((item) => item.totalSales === 0)) {
        setChartData([]);
        setMessage("데이터가 없습니다.");
      } else {
        setMessage("");
        const mapped = data.map((item) => ({
          name: item.policyTitle as string,
          total: item.totalSales,
        }));
        setChartData(mapped);
      }
    } else {
      setMessage("데이터가 유효하지 않습니다.");
    }
    setLoading(false);
  };

  useEffect(() => {
    onFetchChart();
  }, [selectedQuarter]);

  return (
    <div>
      <h2>판매 수량 통계</h2>
      <div style={{ marginBottom: 16, display: "flex", gap: 12 }}>
        {[
          { to: "/statistics/sales-quantity/period", label: "기간별" },
          { to: "/statistics/sales-quantity/branch", label: "지점별" },
          {
            to: "/statistics/sales-quantity/discount-policy",
            label: "할인항목별",
          },
          { to: "/statistics/sales-quantity/category", label: "카테고리별" },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#265185" : "#f0f0f0",
              color: isActive ? "white" : "#333",
              padding: "10px 20px",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: isActive ? "bold" : "normal",
              transition: "background-color 0.3s",
            })}
          >
            {label}
          </NavLink>
        ))}
      </div>

      <div style={{ margin: 30 }}>
        <div style={{ display: "flex", gap: 12, margin: 16 }}>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{ width: 150 }}
          >
            {yearRange.map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>
          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(Number(e.target.value))}
            style={{ width: 150 }}
          >
            <option value={1}>1분기 (1~3월)</option>
            <option value={2}>2분기 (4~6월)</option>
            <option value={3}>3분기 (7~9월)</option>
            <option value={4}>4분기 (10~12월)</option>
          </select>
          <div>
            <button onClick={onFetchChart} style={{ margin: 10 }}>
              새로고침
            </button>
          </div>
        </div>

        {loading ? (
          <div>불러오는 중...</div>
        ) : (
          <BarChart
            width={1400}
            height={600}
            data={chartData}
            layout="vertical"
            margin={{ top: 40, bottom: 20, left: 20, right: 20 }}
          >
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={200} />
            <Tooltip />
            <Bar
              dataKey="total"
              fill="#0088FE"
              label={{ position: "right", fill: "#333", fontSize: 12 }}
              barSize={40}
            >
              {chartData.map((data, idx) => (
                <Cell key={idx} cursor="pointer" />
              ))}
            </Bar>
          </BarChart>
        )}
        <p>{message}</p>
      </div>
    </div>
  );
}

export default SalesQuantityByDiscountPolicy;
