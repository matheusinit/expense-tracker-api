import UpdateExpenseController from '@/controller/update-expense-controller'
import ExpenseRepository from '@/repository/expense-repository'

export const makeUpdateExpenseControllerFactory = () => {
  const expenseRepository = new ExpenseRepository()
  const updateExpenseController = new UpdateExpenseController(expenseRepository)

  return updateExpenseController
}