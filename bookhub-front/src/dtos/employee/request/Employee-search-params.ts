import { Status } from "@/apis/enums/StatusType";

export interface EmployeeSearchParams {
  page: number;
  size: number;
  name: string;
  branchId: number;
  positionId: number;
  authorityId: number;
  status: Status;
}
