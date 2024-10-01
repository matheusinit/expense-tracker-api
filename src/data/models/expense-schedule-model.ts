export type ExpenseScheduleModel = {
  id: string
  description: string
  totalAmount: number
  status: string
  period: Date
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}