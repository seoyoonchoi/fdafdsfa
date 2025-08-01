import { Employee } from "@/dtos/employee/employee";

export interface SignInResponseDto {
  token: string;
  exprTime: number;
  employee: Employee;
}