import ExpenseRepositoryRelationalDatabase from '@/infra/database/repository/expense-repository'
import { ExpenseScheduleRepositoryRelationalDatabase } from '@/infra/database/repository/expense-schedule-repository'
import ViewExpensesFromExpenseScheduleController from '@/http/controller/view-expenses-from-expense-schedule-controller'

export const makeViewExpensesFromExpenseScheduleController = () => {
  const expenseScheduleRepository = new ExpenseScheduleRepositoryRelationalDatabase()
  const expenseRepository = new ExpenseRepositoryRelationalDatabase()
  const controller = new ViewExpensesFromExpenseScheduleController(expenseScheduleRepository, expenseRepository)

  return controller
}