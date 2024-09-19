import ViewExpensesController from '@/http/controller/view-expenses-controller'
import ExpenseRepositoryRelationalDatabase from '@/infra/database/repository/expense-repository'

export const makeViewExpensesController = () => {
  const expenseRepository = new ExpenseRepositoryRelationalDatabase()
  const viewExpensesController = new ViewExpensesController(expenseRepository)

  return viewExpensesController
}