import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import './config/environment'
import { applyCustomCsrfErrors } from './middleware/custom-csrf-errors'
import { applyCsrfTokenController } from './controller/csrf-token-controller'
import { csrf } from './middleware/csrf'
import { serverSession } from './middleware/session'
import { makeAddExpenseController } from './factory/add-expense-controller-factory'
import ViewExpensesController from './controller/view-expenses-controller'

const app = express()

app.use(cookieParser())
app.use(serverSession)

app.use(express.json())
app.use(helmet())
app.use(csrf)
app.get('/csrf-token', applyCsrfTokenController)
app.use(applyCustomCsrfErrors)

const viewExpensesController = new ViewExpensesController()
// Set a prefix route path like '/v1' to all routes

const router = express.Router()

router.get('/expenses', (request, response) => viewExpensesController.handle(request, response))
router.post('/expenses', (request, response) => makeAddExpenseController().handle(request, response))

app.use('/v1', router)

export default app