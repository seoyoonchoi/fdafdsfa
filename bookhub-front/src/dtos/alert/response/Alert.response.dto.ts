export interface AlertResponseDto {
  alertId: number;
  alertType: string;
  message: string;
  alertTargetTable: string;
  targetPk: number;
  targetIsbn: string;
  isRead: boolean;
  createdAt: string;
}