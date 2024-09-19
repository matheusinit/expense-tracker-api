import UpdateExpenseController from '@/http/controller/update-expense-controller'
import ExpenseRepository from '@/infra/database/repository/expense-repository'

export const makeUpdateExpenseController = () => {
  const expenseRepository = new ExpenseRepository()
  const updateExpenseController = new UpdateExpenseController(expenseRepository)

  return updateExpenseController
}