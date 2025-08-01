import { zeroStockRequest } from "@/apis/statistics/stocksStatistics/stocksStatistics";
import { ZeroStockResponseDto } from "@/dtos/statistics/stocksStatistics/response/ZeroStock.response.dto";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { NavLink } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ZeroStockStatistics() {
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;
  const [form, setForm] = useState<ZeroStockResponseDto[]>([]);

  const onFetchZeroStockCountChart = async () => {
    if (!token) {
      alert("권한이 없습니다.");
      return;
    }

    const response = await zeroStockRequest(token);
    const { code, message, data } = response;

    if (code == "SU" && data) {
      setForm(data);
    } else {
      console.error(message);
      return;
    }
  };

  useEffect(() => {
    onFetchZeroStockCountChart();
  }, [token]);

  return (
    <div>
      <div>
        <h2>재고 통계</h2>
        <div>
          {[
            { to: "/statistics/stocks/branch", label: "지점별" },
            { to: "/statistics/stocks/category", label: "카테고리별" },
            {
              to: "/statistics/stocks/time",
              label: "월별",
            },
            { to: "/statistics/stocks/zero", label: "재고 개수별" },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </div>
      </div>
      <div>
        <h3>재고가 0인 책 개수</h3>
        <button onClick={onFetchZeroStockCountChart}>새로고침</button>
      </div>

      <div>
        <div style={{ height: "700px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={form}
              margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="branchName"
                interval={0}
                angle={-25}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="zeroStockCount" name="책 개수" fill="#eac360"></Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ZeroStockStatistics;
