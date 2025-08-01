import { fetchBranchRevenue } from "@/apis/statistics/revenue/revenueStatistics";
import { ResponseDto } from "@/dtos";
import { BranchRevenueResponseDto } from "@/dtos/statistics/revenue/Revenue.response.dto";

import { useState } from "react";
import { useCookies } from "react-cookie";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

interface FormData {
  startDate: string;
  endDate: string;
}

const COLOR_PALETTE = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#d066e1"
  // 필요하면 더 추가
];

function BranchRevenue() {
  const [cookies] = useCookies(['accessToken']);
  const token = cookies.accessToken;
  const [form, setForm] = useState<FormData>({ startDate: '', endDate: '' });
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!token) {
      setError('로그인이 필요합니다.');
      return;
    }
    if (!form.startDate || !form.endDate) {
      setError('시작일과 종료일을 선택해주세요.');
      return;
    }
    setLoading(true);
    setError(null);
    const res: ResponseDto<BranchRevenueResponseDto[]> = await fetchBranchRevenue(
      token,
      form.startDate,
      form.endDate
    );
    if (res.code === 'SU') {
const raw: BranchRevenueResponseDto[] = res.data ?? [];      const branchMap: Record<string, any> = {};
      const cats = new Set<string>();
      raw.forEach((item) => {
        const name = item.branchName;
        if (!branchMap[name]) branchMap[name] = { branchName: name };
        branchMap[name][item.categoryName] = item.totalRevenue;
        cats.add(item.categoryName);
      });
      setCategories(Array.from(cats));
      setData(Object.values(branchMap));
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">지점별 매출 통계</h2>
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center">
          시작일:
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="border rounded p-1 ml-2"
          />
        </label>
        <label className="flex items-center">
          종료일:
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="border rounded p-1 ml-2"
          />
        </label>
        <button
          onClick={handleSubmit}
          className="ml-2 px-4 py-1 bg-blue-500 text-white rounded"
        >
          조회
        </button>
      </div>
      {loading && <p>로딩 중...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && data.length > 0 && (
        <BarChart width={700} height={400} data={data} className="mx-auto">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="branchName" />
          <YAxis />
          <Tooltip />
          <Legend />
          {categories.map((cat,idx) => (
            <Bar key={cat} dataKey={cat} stackId="a"
            fill={COLOR_PALETTE[idx % COLOR_PALETTE.length]} />
          ))}
        </BarChart>
      )}
    </div>
  );
};

export default BranchRevenue;
