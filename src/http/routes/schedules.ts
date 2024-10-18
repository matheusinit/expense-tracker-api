import { Router } from 'express'
import { makeDetailExpenseScheduleController } from '@/http/factory/detail-expense-schedule-controller-factory'
import { makeViewExpensesFromExpenseScheduleController } from '@/http/factory/view-expenses-from-expense-schedule-controller-factory'

const router = Router()

router.get('/:id', (request, response) => makeDetailExpenseScheduleController().handle(request, response))
router.get('/:id/expenses', (request, response) => makeViewExpensesFromExpenseScheduleController().handle(request, response))

export { router }