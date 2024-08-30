import express from 'express'
import 'dotenv/config'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

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

app.get('/v1/expenses', (request, response) => viewExpensesController.handle(request, response))
app.post('/v1/expenses', (request, response) => makeAddExpenseController().handle(request, response))

export default app