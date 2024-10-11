import { Router } from 'express'

import { makeAddExpenseController } from '@/http/factory/add-expense-controller-factory'
import { makeDeleteExpenseController } from '@/http/factory/delete-expense-controller-factory'
import { makeUpdateExpenseController } from '@/http/factory/update-expense-controller-factory'
import { makeViewExpensesController } from '@/http/factory/view-expense-controller-factory'
import { makeScheduleExpenseController } from '../factory/schedule-expense-controller'
import DetailExpenseScheduleController from '../controller/detail-expense-schedule-controller'
import { ExpenseScheduleRepositoryRelationalDatabase } from '@/infra/database/repository/expense-schedule-repository'

const router = Router()

router.get('/expenses', (request, response) => makeViewExpensesController().handle(request, response))
router.post('/expenses', (request, response) => makeAddExpenseController().handle(request, response))
router.put('/expenses/:id', (request, response) => makeUpdateExpenseController().handle(request, response))
router.delete('/expenses/:id', (request, response) => makeDeleteExpenseController().handle(request, response))

router.post('/expenses/:id/schedules', (request, response) => makeScheduleExpenseController().handle(request, response))

const repository = new ExpenseScheduleRepositoryRelationalDatabase()
const controller = new DetailExpenseScheduleController(repository)

router.get('/schedules/:id', (request, response) => controller.handle(request, response))

export default router