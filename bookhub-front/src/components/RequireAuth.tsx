import { useEmployeeStore } from "@/stores/employee.store";
import { Navigate, useLocation } from "react-router-dom";

type RequireRoleProps = {
  allowedRoles: string[];
  children: React.ReactNode;
};

function RequireAuth({ allowedRoles, children }: RequireRoleProps) {
  const employee = useEmployeeStore((state) => state.employee);
  const location = useLocation();

  if (!employee || !allowedRoles.includes(employee.authorityName)) {
    alert("권한이 없습니다.");
    return <Navigate to="/main" replace state={{ from: location }} />;
  }

  return <div>{children}</div>;
}

export default RequireAuth;
