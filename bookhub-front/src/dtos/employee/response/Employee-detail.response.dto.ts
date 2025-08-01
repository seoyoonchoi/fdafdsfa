import { Status } from "@/apis/enums/StatusType";

export interface EmployeeDetailResponseDto {
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
  phoneNumber: string;
  birthDate: string;
  status: Status;
  createdAt: string;
}
