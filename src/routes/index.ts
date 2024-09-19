import { Router } from 'express'

import { makeAddExpenseController } from '@/factory/add-expense-controller-factory'
import { makeDeleteExpenseController } from '@/factory/delete-expense-controller-factory'
import { makeUpdateExpenseControllerFactory } from '@/factory/update-expense-controller-factory'
import { makeViewExpensesController } from '@/factory/view-expense-controller-factory'

const router = Router()

router.get('/expenses', (request, response) => makeViewExpensesController().handle(request, response))
router.post('/expenses', (request, response) => makeAddExpenseController().handle(request, response))
router.put('/expenses/:id', (request, response) => makeUpdateExpenseControllerFactory().handle(request, response))
router.delete('/expenses/:id', (request, response) => makeDeleteExpenseController().handle(request, response))

export default router