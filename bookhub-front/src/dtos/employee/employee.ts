import { ApprovalStatus } from "@/apis/enums/ApprovalType";
import { Status } from "@/apis/enums/StatusType";

export type Employee = {
  employeeId: number;
  employeeNumber: number;
  employeeName: string;
  branchId: number;
  branchName: string;
  positionId: number;
  positionName: string;
  authorityId: number;
  authorityName: string;
  email: string;
  brithDate: string;
  status: Status;
  isApproved: ApprovalStatus;
  created: string;
}