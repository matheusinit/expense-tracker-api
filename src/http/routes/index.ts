import { Router } from 'express'

import { makeAddExpenseController } from '@/http/factory/add-expense-controller-factory'
import { makeDeleteExpenseController } from '@/http/factory/delete-expense-controller-factory'
import { makeUpdateExpenseController } from '@/http/factory/update-expense-controller-factory'
import { makeViewExpensesController } from '@/http/factory/view-expense-controller-factory'
import ScheduleExpenseController from '../controller/schedule-expense-controller'
import ExpenseRepositoryRelationalDatabase from '@/infra/database/repository/expense-repository'

const router = Router()

router.get('/expenses', (request, response) => makeViewExpensesController().handle(request, response))
router.post('/expenses', (request, response) => makeAddExpenseController().handle(request, response))
router.put('/expenses/:id', (request, response) => makeUpdateExpenseController().handle(request, response))
router.delete('/expenses/:id', (request, response) => makeDeleteExpenseController().handle(request, response))

const repository = new ExpenseRepositoryRelationalDatabase()
const scheduleExpenseController = new ScheduleExpenseController(repository)

router.post('/expenses/:id/schedule', (request, response) => scheduleExpenseController.handle(request, response))

export default router