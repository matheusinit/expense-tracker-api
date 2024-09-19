import ViewExpensesController from '@/controller/view-expenses-controller'
import ExpenseRepository from '@/repository/expense-repository'

export const makeViewExpensesController = () => {
  const expenseRepository = new ExpenseRepository()
  const viewExpensesController = new ViewExpensesController(expenseRepository)

  return viewExpensesController
}