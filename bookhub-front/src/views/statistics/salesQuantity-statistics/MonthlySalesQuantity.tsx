import { getMonthlySalesQuantity } from '@/apis/statistics/salesQuantityStatistics/SalesQuantityStatistics';
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type CharData = { name: string; total: number };

function MonthlySalesQuantity() {
  const [cookies] = useCookies(["accessToken"]);
  const [charData, setCharData] = useState<CharData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const thisYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 5 }, (_, i) => thisYear - 4 + i).sort(
    (a, b) => b - a
  );
  const  [selectedYear, setSelectedYear] = useState<number>(thisYear);
  const monthRange = Array.from({ length: 12 }, (_, i) => i + 1);
  const token = cookies.accessToken as string;

  const onFetchChart = async () => {
    if (!token) return;
    setLoading(true);

    const response = await getMonthlySalesQuantity(selectedYear, token);
    const { code, message, data } = response;

    if (code != "SU") {
      alert(`${message}`)
      return;
    }

    if (Array.isArray(data)) {
      const mapped = monthRange.map((month) => {
        const foundData = data.find((item) => item.orderMonth === month);
        return {
          name: `${month}월`,
          total: foundData ? foundData.totalSales : 0,
        };
      });
      setCharData(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    onFetchChart();
  }, [selectedYear]);

  return (
    <div>
      <h4>월별 통계</h4>
      <div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {yearRange.map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>
      </div>

      {loading ? (
        <div>불러오는 중...</div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={charData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total">
              {charData.map((data, idx) => (
                <Cell key={idx} cursor="pointer" fill="#FFBB28" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default MonthlySalesQuantity