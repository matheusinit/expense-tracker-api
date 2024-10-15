import { Router } from 'express'
import { makeDetailExpenseScheduleController } from '@/http/factory/detail-expense-schedule-controller-factory'
import ViewExpensesFromExpenseScheduleController from '@/http/controller/view-expenses-from-expense-schedule-controller'
import { ExpenseScheduleRepositoryRelationalDatabase } from '@/infra/database/repository/expense-schedule-repository'

const router = Router()

router.get('/:id', (request, response) => makeDetailExpenseScheduleController().handle(request, response))
const repository = new ExpenseScheduleRepositoryRelationalDatabase()
const controller = new ViewExpensesFromExpenseScheduleController(repository)
router.get('/:id/expenses', (request, response) => controller.handle(request, response))

export { router }