import AddExpenseController from '@/http/controller/add-expense-controller'
import ExpenseRepository from '@/infra/database/repository/expense-repository'

export const makeAddExpenseController = () => {
  const expenseRepository = new ExpenseRepository()
  const addExpenseController = new AddExpenseController(expenseRepository)

  return addExpenseController
}