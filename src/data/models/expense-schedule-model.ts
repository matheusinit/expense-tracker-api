export type ExpenseScheduleModel = {
  id: string
  totalAmount: number
  status: string
  period: Date
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}