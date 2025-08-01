import { ExitReasonType } from "@/apis/enums/ExitReasonType";
import { Status } from "@/apis/enums/StatusType";

export interface EmployeeExitLogsResponseDto {
  exitId: number;
  employeeNumber: number;
  employeeName: string;
  branchName: string;
  positionName: string;
  status: Status;
  exitReason: ExitReasonType;
  authorizerNumber: number;
  authorizerName: string;
  updatedAt: string;
}