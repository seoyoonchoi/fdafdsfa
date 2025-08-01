export const PurchaseOrderStatus = {
  REQUESTED : 'REQUESTED',
  APPROVED : 'APPROVED',
  REJECTED : 'REJECTED'
}as const;

export type PurchaseOrderStatus = typeof PurchaseOrderStatus[keyof typeof PurchaseOrderStatus];