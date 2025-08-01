import { Routes, Route } from "react-router-dom";
import BranchRevenue from "./BranchRevenue";
import MonthlyRevenue from "./MonthlyRevenue";
import RevenueDashboard from "./RevenueDashboard";
import WeekdayRevenue from "./WeekdayRevenue";
import WeeklyRevenue from "./WeeklyRevenue";

function Revenue() {
  return (
    <Routes>
      <Route index element = {<RevenueDashboard/>}/>
      <Route path="weekday" element={<WeekdayRevenue/>}/>
      <Route path="weekly" element={<WeeklyRevenue/>}/>
      <Route path="monthly" element={<MonthlyRevenue/>}/>
      <Route path="branch" element={<BranchRevenue/>}/>
    </Routes>
  )
}

export default Revenue;