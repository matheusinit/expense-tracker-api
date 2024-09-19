import DeleteExpenseController from '@/http/controller/delete-expense-controller'
import ExpenseRepository from '@/infra/database/repository/expense-repository'

export const makeDeleteExpenseController = () => {
  const expenseRepository = new ExpenseRepository()
  const deleteExpenseController = new DeleteExpenseController(expenseRepository)

  return deleteExpenseController
}