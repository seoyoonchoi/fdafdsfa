export interface EmployeeExitLogsSearchParams {
  page: number;
  size: number;
  employeeName: string;
  authorizerName: string;
  exitReason: string;
  startUpdatedAt: string;
  endUpdatedAt: string;
}