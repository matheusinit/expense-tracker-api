import { ExpenseScheduleRepositoryRelationalDatabase } from '@/infra/database/repository/expense-schedule-repository'
import DetailExpenseScheduleController from '@/http/controller/detail-expense-schedule-controller'

export const makeDetailExpenseScheduleController = (): DetailExpenseScheduleController => {
  const repository = new ExpenseScheduleRepositoryRelationalDatabase()
  return new DetailExpenseScheduleController(repository)
}