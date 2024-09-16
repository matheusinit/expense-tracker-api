import { Router } from 'express'

import DeleteExpenseController from '@/controller/delete-expense-controller'
import UpdateExpenseController from '@/controller/update-expense-controller'
import ViewExpensesController from '@/controller/view-expenses-controller'
import { makeAddExpenseController } from '@/factory/add-expense-controller-factory'
import ExpenseRepository from '@/repository/expense-repository'

const viewExpensesController = new ViewExpensesController()
const expenseRepository = new ExpenseRepository()
const updateExpenseController = new UpdateExpenseController(expenseRepository)
const deleteExpenseController = new DeleteExpenseController(expenseRepository)

const router = Router()

router.get('/expenses', (request, response) => viewExpensesController.handle(request, response))
router.post('/expenses', (request, response) => makeAddExpenseController().handle(request, response))
router.put('/expenses/:id', (request, response) => updateExpenseController.handle(request, response))
router.delete('/expenses/:id', (request, response) => deleteExpenseController.handle(request, response))

export default router