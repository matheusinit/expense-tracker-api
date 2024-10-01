import ExpenseRepositoryRelationalDatabase from '@/infra/database/repository/expense-repository'
import { ExpenseScheduleRepositoryRelationalDatabase } from '@/infra/database/repository/expense-schedule-repository'
import ScheduleExpenseController from '../controller/schedule-expense-controller'

export const makeScheduleExpenseController = (): ScheduleExpenseController => {
  const repository = new ExpenseRepositoryRelationalDatabase()

  // eslint-disable-next-line @stylistic/max-len
  const expenseScheduleRepository = new ExpenseScheduleRepositoryRelationalDatabase()
  const scheduleExpenseController = new ScheduleExpenseController(
    repository,
    expenseScheduleRepository
  )

  return scheduleExpenseController
}