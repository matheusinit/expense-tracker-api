import { Router } from 'express'
import { makeDetailExpenseScheduleController } from '@/http/factory/detail-expense-schedule-controller-factory'

const router = Router()

router.get('/:id', (request, response) => makeDetailExpenseScheduleController().handle(request, response))

export { router }