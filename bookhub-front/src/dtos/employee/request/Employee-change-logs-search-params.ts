export interface EmployeeChangeLogsSearchParams {
  page: number;
  size: number;
  employeeName: string;
  authorizerName: string;
  changeType: string;
  startUpdatedAt: string;
  endUpdatedAt: string;
}