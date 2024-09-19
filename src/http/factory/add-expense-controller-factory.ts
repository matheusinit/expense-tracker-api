import AddExpenseController from '@/http/controller/add-expense-controller'
import ExpenseRepositoryRelationalDatabase from '@/infra/database/repository/expense-repository'

export const makeAddExpenseController = () => {
  const expenseRepository = new ExpenseRepositoryRelationalDatabase()
  const addExpenseController = new AddExpenseController(expenseRepository)

  return addExpenseController
}