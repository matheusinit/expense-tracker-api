import DeleteExpenseController from '@/controller/delete-expense-controller'
import ExpenseRepository from '@/repository/expense-repository'

export const makeDeleteExpenseController = () => {
  const expenseRepository = new ExpenseRepository()
  const deleteExpenseController = new DeleteExpenseController(expenseRepository)

  return deleteExpenseController
}