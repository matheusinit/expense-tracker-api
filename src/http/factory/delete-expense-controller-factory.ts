import DeleteExpenseController from '@/http/controller/delete-expense-controller'
import ExpenseRepositoryRelationalDatabase from '@/infra/database/repository/expense-repository'

export const makeDeleteExpenseController = () => {
  const expenseRepository = new ExpenseRepositoryRelationalDatabase()
  const deleteExpenseController = new DeleteExpenseController(expenseRepository)

  return deleteExpenseController
}