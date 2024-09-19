import UpdateExpenseController from '@/http/controller/update-expense-controller'
import ExpenseRepositoryRelationalDatabase from '@/infra/database/repository/expense-repository'

export const makeUpdateExpenseController = () => {
  const expenseRepository = new ExpenseRepositoryRelationalDatabase()
  const updateExpenseController = new UpdateExpenseController(expenseRepository)

  return updateExpenseController
}