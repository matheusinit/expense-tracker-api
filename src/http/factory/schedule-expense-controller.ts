import ExpenseRepositoryRelationalDatabase from '@/infra/database/repository/expense-repository'
import { ExpenseScheduleRepositoryRelationalDatabase } from '@/infra/database/repository/expense-schedule-repository'
import ScheduleExpenseController from '../controller/schedule-expense-controller'
import { ScheduleExpenseService } from '@/data/services/schedule-expense'

export const makeScheduleExpenseController = (): ScheduleExpenseController => {
  const repository = new ExpenseRepositoryRelationalDatabase()

  // eslint-disable-next-line @stylistic/max-len
  const expenseScheduleRepository = new ExpenseScheduleRepositoryRelationalDatabase()

  const scheduleExpenseService = new ScheduleExpenseService(
    repository,
    expenseScheduleRepository
  )

  const scheduleExpenseController = new ScheduleExpenseController(
    scheduleExpenseService
  )

  return scheduleExpenseController
}