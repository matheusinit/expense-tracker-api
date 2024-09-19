import ViewExpensesController from '@/http/controller/view-expenses-controller'
import ExpenseRepository from '@/infra/database/repository/expense-repository'

export const makeViewExpensesController = () => {
  const expenseRepository = new ExpenseRepository()
  const viewExpensesController = new ViewExpensesController(expenseRepository)

  return viewExpensesController
}