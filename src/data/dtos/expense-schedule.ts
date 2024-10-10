export type ExpenseScheduleDTO = {
  id: string
  status: string
  period: string
  totalAmount: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}