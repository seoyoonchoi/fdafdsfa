import { Status } from "@/apis/enums/StatusType";

export interface EmployeeExitUpdateRequestDto {
  status: Status;
  exitReason: string;
}
