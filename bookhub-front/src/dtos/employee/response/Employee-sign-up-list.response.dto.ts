import { ApprovalStatus } from "@/apis/enums/ApprovalType";

export interface EmployeeSignUpListResponseDto {
  approvalId: number;
  employeeId: number;
  employeeNumber: string;
  employeeName: string;
  branchName: string;
  email: string;
  phoneNumber: string;
  appliedAt: string;
  isApproved: ApprovalStatus;
}