import { Router } from 'express'
import { makeDetailExpenseScheduleController } from '@/http/factory/detail-expense-schedule-controller-factory'
import ViewExpensesFromExpenseScheduleController from '@/http/controller/view-expenses-from-expense-schedule-controller'

const router = Router()

router.get('/:id', (request, response) => makeDetailExpenseScheduleController().handle(request, response))
router.get('/:id/expenses', (request, response) => (new ViewExpensesFromExpenseScheduleController).handle(request, response))

export { router }