import express from 'express'
import AddExpenseController from './controller/add-expense-controller'
import 'dotenv/config'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import ExpenseRepository from './repository/expense-repository'
import { errorHandler } from './middleware/error-handler'
import { applyCsrfTokenController } from './controller/csrf-token-controller'
import { csrf } from './middleware/csrf'
import { serverSession } from './middleware/session'

const app = express()

app.use(cookieParser())
app.use(serverSession)

app.use(express.json())
app.get('/csrf-token', applyCsrfTokenController)
app.use(csrf)
app.use(helmet())
app.use(errorHandler)

const expenseRepository = new ExpenseRepository()
const addExpenseController = new AddExpenseController(expenseRepository)

app.post('/v1/expenses', (request, response) => addExpenseController.handle(request, response))

export default app