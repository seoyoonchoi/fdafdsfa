import { getDailySalesQuantity } from '@/apis/statistics/salesQuantityStatistics/SalesQuantityStatistics';
import { eachDayOfInterval, lastDayOfMonth } from 'date-fns';
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, Cell, BarChart } from 'recharts';

type CharData = { name: string; total: number };

function DailySalesQuantity() {
  const [cookies] = useCookies(["accessToken"]);
  const [charData, setCharData] = useState<CharData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  const thisYear = new Date().getFullYear();

  let dayRange = eachDayOfInterval({
    start: new Date(new Date().getFullYear(), selectedMonth - 1, 1),
    end: lastDayOfMonth(new Date(new Date().getFullYear(), selectedMonth - 1)),
  });
  const start = new Date(thisYear, selectedMonth - 1, 1);
  const end = lastDayOfMonth(start);
  dayRange = eachDayOfInterval({ start, end });

  const token = cookies.accessToken as string;

  const onFetchChart = async () => {
    if (!token) return;
    setLoading(true);

    const response = await getDailySalesQuantity(selectedMonth, token);
    const { code, message, data } = response;

    if (code != "SU") {
      alert(`${message}`)
      return;
    }

    if (Array.isArray(data)) {
      const mapped = dayRange.map((day) => {
        const foundData = data.find((item) => {
          const d = new Date(item.orderDate!);
          return d.toDateString() === day.toDateString();
        });

        return {
          name: `${selectedMonth}/${day.getDate()}`,
          total: foundData ? foundData.totalSales : 0,
        };
      });
      setCharData(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    onFetchChart();
  }, [selectedMonth]);
  
  return (
    <div>
      <h4>일일 통계</h4>
      <div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}>
            {[...Array(12)].map((_, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {idx + 1}월
              </option>
            ))}
          </select>
          <button onClick={onFetchChart} style={{margin: 10}}>
            새로고침
          </button>
      </div>

      {loading ? (
        <div>불러오는 중...</div>
      ) : (
        <ResponsiveContainer>
          <BarChart data={charData}>
            <XAxis dataKey="name" angle={-30} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total">
              {charData.map((data, idx) => (
                <Cell key={idx} cursor="pointer" fill="#0088FE" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default DailySalesQuantity