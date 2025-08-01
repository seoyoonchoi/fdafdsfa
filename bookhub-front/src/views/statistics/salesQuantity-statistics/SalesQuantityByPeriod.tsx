import { NavLink } from "react-router-dom";
import DailySalesQuantity from "./DailySalesQuantity";
import MonthlySalesQuantity from "./MonthlySalesQuantity";
import WeeklySalesQuantity from "./WeeklySalesQuantity";

function SaleQuantityByPeriod() {
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

      <div style={{ marginTop: 0, marginLeft: 20 }}>
        <DailySalesQuantity />
      </div>
      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 64,
        }}
      >
        <div style={{ flex: 1 }}>
          <WeeklySalesQuantity />
        </div>
        <div style={{ flex: 1 }}>
          <MonthlySalesQuantity />
        </div>
      </div>
    </div>
  );
}

export default SaleQuantityByPeriod;
