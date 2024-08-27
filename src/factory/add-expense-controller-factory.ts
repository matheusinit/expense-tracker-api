import AddExpenseController from '../controller/add-expense-controller'
import ExpenseRepository from '../repository/expense-repository'

export const makeAddExpenseController = () => {
  const expenseRepository = new ExpenseRepository()
  const addExpenseController = new AddExpenseController(expenseRepository)

  return addExpenseController
}