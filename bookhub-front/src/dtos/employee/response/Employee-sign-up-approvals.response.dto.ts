import { ApprovalStatus } from "@/apis/enums/ApprovalType";

export interface EmployeeSignUpApprovalsResponseDto {
  approvalId: number;
  employeeNumber: number;
  employeeName: string;
  appliedAt: string;
  isApproved: ApprovalStatus;
  deniedReason: string | undefined;
  authorizerNumber: number;
  authorizerName: string;
  updatedAt: string;
}