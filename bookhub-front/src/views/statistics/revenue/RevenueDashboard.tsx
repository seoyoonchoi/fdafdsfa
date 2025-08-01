import BranchRevenue from "./BranchRevenue";
import MonthlyRevenue from "./MonthlyRevenue";
import WeekdayRevenue from "./WeekdayRevenue";
import WeeklyRevenue from "./WeeklyRevenue";

function RevenueDashboard() {
  return (
    
    <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "12px",
        width: "200vh",
        height: "50vh",
        padding: "12px",
      }}>
<div><WeekdayRevenue/></div>
<div><BranchRevenue/></div>
<div><WeeklyRevenue/></div>
<div><MonthlyRevenue/></div>

      </div>
  )
}

export default RevenueDashboard;