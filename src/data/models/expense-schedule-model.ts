export type ExpenseScheduleModel = {
  id: string
  status: string
  period: Date
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}