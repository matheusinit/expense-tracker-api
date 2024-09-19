export interface ExpenseModel {
  id: string
  amount: number
  description: string
  dueDate: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}