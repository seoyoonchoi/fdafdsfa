import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip } from "recharts";
import { NavLink } from "react-router-dom";
import { getSalesQuantityByBranch } from "@/apis/statistics/salesQuantityStatistics/SalesQuantityStatistics";

type ChartData = { name: string; total: number };

function SaleQuantityByBranch() {
  const [cookies] = useCookies(["accessToken"]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const thisYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 5 }, (_, i) => thisYear - 4 + i).sort(
    (a, b) => b - a
  );
  const [selectedYear, setSelectedYear] = useState<number>(thisYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  const token = cookies.accessToken as string;

  // 새로고침하면 차트 갱신
  const onFetchChart = async () => {
    if (!token) return;
    setLoading(true);

    const response = await getSalesQuantityByBranch(
      selectedYear,
      selectedMonth,
      token
    );
    const { code, message, data } = response;

    if (code != "SU") {
      return;
    }

    if (Array.isArray(data)) {
      const mapped = data.map((item) => ({
        name: item.branchName as string,
        total: item.totalSales,
      }));
      setChartData(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    onFetchChart();
  }, [selectedMonth]);

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
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            style={{ width: 150 }}
          >
            {[...Array(12)].map((_, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {idx + 1}월
              </option>
            ))}
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
            margin={{ top: 40, right: 20, bottom: 40, left: 20 }}
          >
            <XAxis dataKey="name" angle={-30} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" barSize={40}>
              {chartData.map((data, idx) => (
                <Cell key={idx} cursor="pointer" fill="#0088FE" />
              ))}
            </Bar>
          </BarChart>
        )}
      </div>
    </div>
  );
}

export default SaleQuantityByBranch;
