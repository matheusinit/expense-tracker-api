export type ExpenseScheduleDTO = {
  id: string
  status: string
  period: Date
  totalAmount: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}