import { ExpenseScheduleStatus } from '@/data/value-objects/expense-schedule-status'
import { Expense } from './expense'

export interface ExpenseSchedule {
  // January - December

  // Based on the billings month of payment
  month: string

  // e.g. 2024
  // Based on the billings month of payment
  year: number

  // e.g. 80000
  // Sum of cost of all expenses
  total: number

  // e.g. 'PAID', 'OVERDUE', 'OPEN'
  status: ExpenseScheduleStatus

  expenses: Expense[]

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}