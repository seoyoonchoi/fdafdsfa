import { branchRequest } from "@/apis/branch/branch";
import { categoryStockRequest } from "@/apis/statistics/stocksStatistics/stocksStatistics";
import { BranchDetailResponseDto } from "@/dtos/branch/response/Branch-detail.response.dto";
import { CategoryStockSearchParams } from "@/dtos/statistics/stocksStatistics/repuest/CategoryStockSearchParams";
import { CategoryStockResponseDto } from "@/dtos/statistics/stocksStatistics/response/CategoryStock.response.dto";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { NavLink } from "react-router-dom";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

function calculatePercentages(data: CategoryStockResponseDto[]) {
  const total = data.reduce((sum, item) => sum + item.quantity, 0);
  return data
    .map((item) => ({
      ...item,
      percent: total === 0 ? 0 : (item.quantity / total) * 100,
    }))
    .sort((a, b) => b.percent - a.percent)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA336A",
  "#33AA99",
  "#AA6633",
  "#9966AA",
  "#66AA99",
  "#3366AA",
];

function CategoryStockStatistics() {
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;
  const [searchForm, setSearchForm] = useState<CategoryStockSearchParams>({
    branchName: "",
  });
  const [branches, setBranches] = useState<BranchDetailResponseDto[]>([]);
  const [form, setForm] = useState<CategoryStockResponseDto[]>([]);
  const [message, setMessage] = useState("");

  const fetchBranchSelect = async () => {
    const response = await branchRequest();
    const { code, message, data } = response;

    if (code === "SU" && data) {
      setBranches(data);
    } else {
      setMessage(message);
    }
  };

  useEffect(() => {
    fetchBranchSelect();
  }, []);

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchForm({ ...searchForm, [name]: value });
  };

  const onSearchClick = async () => {
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    if (!searchForm.branchName) {
      alert("지점을 선택하세요");
      return;
    }

    const response = await categoryStockRequest(searchForm, token);
    const { code, message, data } = response;

    if (code === "SU" && data) {
      setForm(calculatePercentages(data));
      console.log(calculatePercentages(data));
    } else {
      console.error(message);
    }
  };

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
        <h3>지점별 각 카테고리의 재고 비율</h3>
        <select
          name="branchName"
          value={searchForm.branchName}
          onChange={onSelectChange}
        >
          <option value="">지점을 선택하세요.</option>
          {branches.map((branch) => (
            <option key={branch.branchId} value={branch.branchName}>
              {branch.branchName}
            </option>
          ))}
        </select>
        <button onClick={onSearchClick}>조회</button>
      </div>
      {message && <p>{message}</p>}
      <div>
        <div>
          {form.length > 0 && (
            <PieChart width={800} height={600}>
              <Pie
                data={form}
                dataKey="percent"
                nameKey="categoryName"
                cx="50%"
                cy="50%"
                outerRadius={180}
                label={({ categoryName, percent, rank }) =>
                  `${rank}. ${categoryName} ${percent?.toFixed(1)}%`
                }
              >
                {form.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)}%`,
                  name,
                ]}
              />
              <Legend />
            </PieChart>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryStockStatistics;
