import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
} from "recharts";
import { parseISO, getWeekOfMonth, lastDayOfMonth } from "date-fns";
import { getWeeklySalesQuantity } from "@/apis/statistics/salesQuantityStatistics/SalesQuantityStatistics";

type ChartData = { name: string; total: number };

function WeeklySalesQuantity() {
  const [cookies] = useCookies(["accessToken"]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const thisYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 5 }, (_, i) => thisYear - 4 + i).sort(
    (a, b) => b - a
  );

  const getKoreanWeekLabel = (weekNumber: number, month: number) => {
    const label = ["첫째", "둘째", "셋째", "넷째", "다섯째", "여섯째"];
    const weekLabel = label[weekNumber - 1] ?? `${weekNumber}번째`;
    return `${weekLabel}주`;
  };

  const [selectedYear, setSelectedYear] = useState<number>(thisYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  const token = cookies.accessToken as string;

  const onFetchChart = async () => {
    if (!token) return;
    setLoading(true);

    const response = await getWeeklySalesQuantity(
      selectedYear,
      selectedMonth,
      token
    );
    const { code, message, data } = response;

    if (code != "SU") {
      alert(`${message}`);
      return;
    }

    if (!Array.isArray(data)) {
      setChartData([]);
      setLoading(false);
      return;
    }

    const lastDate = lastDayOfMonth(new Date(thisYear, selectedMonth! - 1));
    const maxWeek = getWeekOfMonth(lastDate);

    const fullWeeksMap = new Map<string, number>();
    for (let weekNum = 1; weekNum <= maxWeek; weekNum++) {
      const label = getKoreanWeekLabel(weekNum, selectedMonth!);
      fullWeeksMap.set(label, 0);
    }

    data.forEach((item) => {
      if (!item.orderDate) return;

      const date = parseISO(item.orderDate);
      if (date.getMonth() + 1 !== selectedMonth) return;

      const week = getWeekOfMonth(date);
      const label = getKoreanWeekLabel(week, selectedMonth);

      fullWeeksMap.set(label, (fullWeeksMap.get(label) ?? 0) + item.totalSales);
    });

    setChartData(
      Array.from(fullWeeksMap, ([name, total]) => ({ name, total }))
    );

    setLoading(false);
  };

  useEffect(() => {
    onFetchChart();
  }, [selectedMonth]);

  return (
    <div
      style={{ width: "100%", maxWidth: 600, margin: "0 auto", padding: 10 }}
    >
      <h4>주간 통계</h4>

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
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" interval={0} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" barSize={40}>
              {chartData.map((data, idx) => (
                <Cell key={idx} cursor="pointer" fill="#00C49F" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default WeeklySalesQuantity;
