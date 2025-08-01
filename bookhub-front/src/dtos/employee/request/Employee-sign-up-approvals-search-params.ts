export interface EmployeeSignUpApprovalsSearchParams {
  page: number;
  size: number;
  employeeName: string;
  authorizerName: string;
  isApproved: string;
  deniedReason?: string ;
  startUpdatedAt: string;
  endUpdatedAt: string;
}