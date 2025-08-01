export interface WeekdayRevenueResponseDto{
  weekday : string;
  total : number;
}

export interface BranchRevenueResponseDto{
  branchId : number;
  branchName : string;
  categoryName : string;
  totalRevenue : number;
}

export interface MonthlyRevenueResponseDto{
  orderMonth : number;
  totalRevenue : number;
}

export interface WeeklyRevenueResponseDto{
  totalRevenue: number;
  orderDate: string;
}