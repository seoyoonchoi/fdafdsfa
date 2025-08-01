import { getCategoryTree } from "@/apis/category/category";
import { getSalesQuantityByCategory } from "@/apis/statistics/salesQuantityStatistics/SalesQuantityStatistics";
import React, { JSX, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { data, NavLink } from "react-router-dom";
import { Cell, Pie, PieChart, Legend } from "recharts";

type ChartData = { name: string; total: number };
type LegendData = { name: string; total: number };

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

function SalesQuantityByCategory() {
  const [cookies] = useCookies(["accessToken"]);
  const [chartData1, setChartData1] = useState<ChartData[]>([]);
  const [chartData2, setChartData2] = useState<ChartData[]>([]);
  const [legendData1, setLegendData1] = useState<LegendData[]>([]);
  const [legendData2, setLegendData2] = useState<LegendData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState("");

  const token = cookies.accessToken as string;

  useEffect(() => {
    const initialize = async () => {
      await fetchLegend();
      await onFetchChart();
    };

    initialize();
  }, []);

  const onFetchChart = async () => {
    if (!token) return;
    setLoading(true);

    const response = await getSalesQuantityByCategory(token);
    const { code, message, data } = response;

    if (code != "SU") {
      alert(`${message}`);
      return;
    }

    if (Array.isArray(data)) {
      if (data.every((item) => item.totalSales === 0)) {
        setChartData1([]);
        setChartData2([]);
        setMessage("데이터가 없습니다.");
      } else {
        setMessage("");

        const domesticData = data.filter(
          (item) => item.categoryType == "DOMESTIC"
        );
        const foreignData = data.filter(
          (item) => item.categoryType == "FOREIGN"
        );

        const mapped1 = domesticData.map((item) => ({
          name: item.categoryName as string,
          total: item.totalSales,
        }));

        const mapped2 = foreignData.map((item) => ({
          name: item.categoryName as string,
          total: item.totalSales,
        }));

        setChartData1(mapped1);
        setChartData2(mapped2);

        setLegendData1((prev) => mergeTotalIntoLegend(prev, mapped1));
        setLegendData2((prev) => mergeTotalIntoLegend(prev, mapped2));
      }
    } else {
      setMessage("데이터가 유효하지 않습니다.");
    }
    setLoading(false);
  };

  const mergeTotalIntoLegend = (
    legend: { name: string }[],
    chart: { name: string; total: number }[]
  ): { name: string; total: number }[] => {
    const chartMap = new Map(chart.map((item) => [item.name, item.total]));
    return legend.map((item) => ({
      name: item.name,
      total: chartMap.get(item.name) ?? 0,
    }));
  };

  const fetchLegend = async () => {
    const responseDomestic = await getCategoryTree(
      "DOMESTIC",
      cookies.accessToken
    );
    const responseForeign = await getCategoryTree(
      "FOREIGN",
      cookies.accessToken
    );

    if (responseDomestic.code != "SU" || responseForeign.code != "SU") {
      return;
    }
    const legendData1 = responseDomestic.data!.map((item) => ({
      name: item.categoryName as string,
      total: 0,
    }));

    const legendData2 = responseForeign.data!.map((item) => ({
      name: item.categoryName as string,
      total: 0,
    }));
    setLegendData1(mergeTotalIntoLegend(legendData1, chartData1));

    setLegendData2(mergeTotalIntoLegend(legendData2, chartData2));
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const renderCustomizedLabelWithData = (
  data: ChartData[]
): ((props: any) => JSX.Element) => (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${data[index].name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

  const renderCustomLegend = (data: LegendData[]) => () =>
    (
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {data.map((entry, index) => (
          <li key={index}>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                backgroundColor: "#999",
                marginRight: 8,
              }}
            />
            {entry.name} ({entry.total.toLocaleString()})
          </li>
        ))}
      </ul>
    );

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
        <button onClick={onFetchChart}>새로고침</button>

        {loading ? (
          <div>불러오는 중...</div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3>국내 도서</h3>
              <PieChart width={600} height={600}>
                <Pie
                  data={chartData1.filter((item) => item.total > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabelWithData(
                    chartData1.filter((item) => item.total > 0)
                  )}
                  outerRadius={150}
                  fill="#8884d8"
                  nameKey="name"
                  dataKey="total"
                >
                  {chartData1
                    .filter((item) => item.total > 0)
                    .map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                </Pie>
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{
                    right: -40,
                    top: "50%",
                    transform: "translate(0, -50%)",
                    lineHeight: "24px",
                  }}
                  content={renderCustomLegend(legendData1)}
                />
              </PieChart>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3>해외도서</h3>
              <PieChart width={600} height={600}>
                <Pie
                  data={chartData2.filter((item) => item.total > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabelWithData(
                    chartData2.filter((item) => item.total > 0)
                  )}
                  outerRadius={150}
                  fill="#8884d8"
                  nameKey="name"
                  dataKey="total"
                >
                  {chartData2
                    .filter((item) => item.total > 0)
                    .map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                </Pie>
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{
                    right: -40,
                    top: "50%",
                    transform: "translate(0, -50%)",
                    lineHeight: "24px",
                  }}
                  content={renderCustomLegend(legendData2)}
                />
              </PieChart>
            </div>
          </div>
        )}
      </div>
      <p>{message}</p>
    </div>
  );
}

export default SalesQuantityByCategory;
