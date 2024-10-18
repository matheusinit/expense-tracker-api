import { Router } from 'express'
import { makeDetailExpenseScheduleController } from '@/http/factory/detail-expense-schedule-controller-factory'
import ViewExpensesFromExpenseScheduleController from '@/http/controller/view-expenses-from-expense-schedule-controller'
import { ExpenseScheduleRepositoryRelationalDatabase } from '@/infra/database/repository/expense-schedule-repository'
import ExpenseRepositoryRelationalDatabase from '@/infra/database/repository/expense-repository'

const router = Router()

router.get('/:id', (request, response) => makeDetailExpenseScheduleController().handle(request, response))
const repository = new ExpenseScheduleRepositoryRelationalDatabase()
const expenseRepository = new ExpenseRepositoryRelationalDatabase()
const controller = new ViewExpensesFromExpenseScheduleController(repository, expenseRepository)
router.get('/:id/expenses', (request, response) => controller.handle(request, response))

export { router }