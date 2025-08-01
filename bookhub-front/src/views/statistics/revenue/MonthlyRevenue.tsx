import { fetchMonthly } from "@/apis/statistics/revenue/revenueStatistics";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, Cell } from "recharts";


type ChartData = { name: string; total: number };

function MonthlyRevenue() {
  const [cookies] = useCookies(["accessToken"]);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const thisYear = new Date().getFullYear();
    const yearRange = Array.from({ length: 5 }, (_, i) => thisYear - 4 + i).sort(
      (a, b) => b - a
    );
    const [selectedYear, setSelectedYear] = useState<number>(thisYear);
  
    const monthRange = Array.from({ length: 12 }, (_, i) => i + 1);
  
    const token = cookies.accessToken as string;

    const onFetchChart = async () => {
      if (!token) return;
      setLoading(true);
  
      const response = await fetchMonthly(selectedYear, token);
      const { code, message, data } = response;
  
      if (code != "SU") {
        // setMessage(message);
        return;
      }
  
      if (Array.isArray(data)) {
        const mapped = monthRange.map((month) => {
          const foundData = data.find((item) => item.orderMonth === month);
          return {
            name: `${month}월`,
            total: foundData ? foundData.totalRevenue : 0,
          };
        });
        setChartData(mapped);
      }
      setLoading(false);
    };
  
    useEffect(() => {
      onFetchChart();
    }, [selectedYear]);
  
    return (
      <div
        style={{ width: "100%", maxWidth: 800, margin: "0 auto", padding: 32 }}
      >
         <h2 className="text-xl font-semibold mb-4">월간 매출 통계</h2>

  
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
          <p>[{selectedYear}년]</p>
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
      </div>
    );
}

export default MonthlyRevenue