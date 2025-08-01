import { fetchWeekly } from "@/apis/statistics/revenue/revenueStatistics";
import { lastDayOfMonth, getWeekOfMonth, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, Cell } from "recharts";

type ChartData = { name: string; total: number };

function WeeklyRevenue() {
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

    const response = await fetchWeekly(token, selectedYear, selectedMonth);
    const { code, message, data } = response;

    if (code != "SU") {
      // setMessage(message);
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

      fullWeeksMap.set(
        label,
        (fullWeeksMap.get(label) ?? 0) + item.totalRevenue
      );
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
    className="p-4"
      // style={{ width: "100%", maxWidth: 600, margin: "0 auto", padding: 32 }}
    >
      <h2 className="text-xl font-semibold mb-4">주간 매출 통계</h2>

      <div style={{ margin: 16 }}>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
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
        >
          {[...Array(12)].map((_, idx) => (
            <option key={idx + 1} value={idx + 1}>
              {idx + 1}월
            </option>
          ))}
        </select>
        <p>[{selectedMonth}월]</p>
      </div>

      {loading ? (
        <div>불러오는 중...</div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total">
              {chartData.map((data, idx) => (
                <Cell key={idx} cursor="pointer" fill="#8884d8" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      <p style={{ textAlign: "center", marginTop: 16 }}>
        {/* {`'${activeItem.name}'요일 매출: ${activeItem.total.toLocaleString()}원`} */}
      </p>
    </div>
  );
}

export default WeeklyRevenue;
